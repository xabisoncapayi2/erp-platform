import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseOrderStatus, MovementReason } from '@prisma/client';

@Injectable()
export class PurchaseOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.purchaseOrder.create({
      data,
    });
  }

  async findOne(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }
    return po;
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: status as PurchaseOrderStatus },
    });
  }

  async submit(id: string, tenantId: string) {
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: PurchaseOrderStatus.SUBMITTED },
      include: { lines: true },
    });
  }

  async receiveOrder(id: string, tenantId: string, dto: { lines: { purchaseOrderLineId: string; quantityReceived: number }[] }) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { lines: true },
    });

    if (!po) throw new NotFoundException('Purchase order not found');

    await this.prisma.$transaction(async (tx) => {
      for (const lineDto of dto.lines) {
        const poLine = po.lines.find((l) => l.id === lineDto.purchaseOrderLineId);
        if (!poLine) continue;

        await tx.purchaseOrderLine.update({
          where: { id: poLine.id },
          data: { quantityReceived: { increment: lineDto.quantityReceived } },
        });

        if (po.warehouseId) {
          const inventoryItem = await tx.inventoryItem.upsert({
            where: {
              productId_warehouseId: {
                productId: poLine.productId,
                warehouseId: po.warehouseId,
              },
            },
            update: {
              quantityOnHand: { increment: lineDto.quantityReceived },
            },
            create: {
              tenantId,
              productId: poLine.productId,
              warehouseId: po.warehouseId,
              quantityOnHand: lineDto.quantityReceived,
            },
          });

          await tx.inventoryMovement.create({
            data: {
              tenantId,
              inventoryItemId: inventoryItem.id,
              quantityChange: lineDto.quantityReceived,
              reason: MovementReason.PURCHASE_RECEIPT,
              referenceId: po.id,
            },
          });
        }
      }
    });

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: PurchaseOrderStatus.RECEIVED },
      include: { lines: true },
    });
  }
}
