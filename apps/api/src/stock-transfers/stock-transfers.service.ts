import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockTransferStatus, MovementReason } from '@prisma/client';

export interface CreateTransferDto {
  productId: string;
  sourceWarehouseId: string;
  destWarehouseId: string;
  quantity: number;
}

@Injectable()
export class StockTransfersService {
  constructor(private prisma: PrismaService) {}

  async transfer(tenantId: string, dto: CreateTransferDto) {
    if (dto.sourceWarehouseId === dto.destWarehouseId) {
      throw new BadRequestException('Source and destination warehouse cannot be the same.');
    }
    if (dto.quantity <= 0) {
      throw new BadRequestException('Transfer quantity must be positive.');
    }

    return this.prisma.$transaction(async (tx) => {
      const sourceItem = await tx.inventoryItem.findUnique({
        where: {
          productId_warehouseId: {
            productId: dto.productId,
            warehouseId: dto.sourceWarehouseId,
          },
        },
      });

      if (!sourceItem) {
        throw new NotFoundException(
          `No inventory for this product in the source warehouse.`,
        );
      }
      if (sourceItem.quantityOnHand < dto.quantity) {
        throw new BadRequestException(
          `Cannot transfer ${dto.quantity} units: source warehouse only has ` +
            `${sourceItem.quantityOnHand} on hand.`,
        );
      }

      await tx.inventoryItem.update({
        where: { id: sourceItem.id },
        data: { quantityOnHand: { decrement: dto.quantity } },
      });

      const transferRecord = await tx.stockTransfer.create({
        data: {
          tenantId,
          productId: dto.productId,
          sourceWarehouseId: dto.sourceWarehouseId,
          destWarehouseId: dto.destWarehouseId,
          quantity: dto.quantity,
          status: StockTransferStatus.PENDING,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          tenantId,
          inventoryItemId: sourceItem.id,
          quantityChange: -dto.quantity,
          reason: MovementReason.ADJUSTMENT,
          referenceId: transferRecord.id,
        },
      });

      const destItem = await tx.inventoryItem.upsert({
        where: {
          productId_warehouseId: {
            productId: dto.productId,
            warehouseId: dto.destWarehouseId,
          },
        },
        update: { quantityOnHand: { increment: dto.quantity } },
        create: {
          tenantId,
          productId: dto.productId,
          warehouseId: dto.destWarehouseId,
          quantityOnHand: dto.quantity,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          tenantId,
          inventoryItemId: destItem.id,
          quantityChange: dto.quantity,
          reason: MovementReason.ADJUSTMENT,
          referenceId: transferRecord.id,
        },
      });

      return tx.stockTransfer.update({
        where: { id: transferRecord.id },
        data: { status: StockTransferStatus.COMPLETED, completedAt: new Date() },
      });
    });
  }
}
