import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneralLedgerService } from '../general-ledger/general-ledger.service';
import { SalesOrderStatus, MovementReason } from '@prisma/client';

export interface SalesOrderLineDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSalesOrderDto {
  customerId: string;
  warehouseId: string;
  lines: SalesOrderLineDto[];
}

@Injectable()
export class SalesOrdersService {
  constructor(
    private prisma: PrismaService,
    private glService: GeneralLedgerService,
  ) {}

  async create(tenantId: string, dto: CreateSalesOrderDto) {
    const rawLines = dto.lines || [];

    return this.prisma.salesOrder.create({
      data: {
        tenantId,
        customerId: dto.customerId,
        warehouseId: dto.warehouseId,
        status: SalesOrderStatus.DRAFT,
        lines: {
          create: rawLines.map((l) => ({
            productId: l.productId,
            quantity: Number(l.quantity || 0),
            unitPrice: Number(l.unitPrice || 0),
          })),
        },
      },
      include: { lines: true },
    });
  }

  async fulfill(orderId: string, tenantId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.findFirst({
        where: { id: orderId, tenantId },
        include: {
          lines: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Sales order ${orderId} not found`);
      }

      if (order.status === SalesOrderStatus.FULFILLED) {
        throw new BadRequestException(`Sales order ${orderId} is already fulfilled`);
      }

      let totalRevenue = 0;
      let totalCost = 0;

      for (const line of order.lines) {
        const qty = Number(line.quantity);
        const price = Number(line.unitPrice);
        totalRevenue += qty * price;

        const inventory = await tx.inventoryItem.findUnique({
          where: {
            productId_warehouseId: {
              productId: line.productId,
              warehouseId: order.warehouseId,
            },
          },
          include: { product: true },
        });

        if (!inventory || inventory.quantityOnHand < qty) {
          throw new BadRequestException(
            `Insufficient stock for product ${line.productId} in warehouse ${order.warehouseId}`,
          );
        }

        const unitCost = Number(inventory.product?.unitCost || line.product?.unitCost || 0);
        totalCost += qty * unitCost;

        // Decrement inventory stock
        await tx.inventoryItem.update({
          where: { id: inventory.id },
          data: {
            quantityOnHand: { decrement: qty },
          },
        });

        // Record InventoryMovement for full audit traceability
        await tx.inventoryMovement.create({
          data: {
            tenantId,
            inventoryItemId: inventory.id,
            quantityChange: -qty,
            reason: MovementReason.SALE,
            referenceId: order.id,
          },
        });
      }

      const updatedOrder = await tx.salesOrder.update({
        where: { id: order.id },
        data: {
          status: SalesOrderStatus.FULFILLED,
          fulfilledAt: new Date(),
        },
        include: { lines: true },
      });

      // Post Real General Ledger Entries for Accounts Receivable, Revenue, COGS, & Inventory
      await this.glService.createEntry(
        tenantId,
        {
          description: `Fulfillment for Sales Order ${order.id}`,
          lines: [
            { accountCode: '1100', debit: totalRevenue, credit: 0 },
            { accountCode: '4000', debit: 0, credit: totalRevenue },
            { accountCode: '5000', debit: totalCost, credit: 0 },
            { accountCode: '1000', debit: 0, credit: totalCost },
          ],
        },
        tx,
      );

      return {
        order: updatedOrder,
        totalRevenue,
        totalCost,
      };
    });
  }
}
