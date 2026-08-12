import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { tenantId },
      include: { product: true },
    });
  }

  async getInventory(tenantId: string) {
    return this.findAll(tenantId);
  }

  async getStockLevel(tenantId: string, productId: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { tenantId, productId },
    });
    return item ? item.quantityOnHand : 0;
  }

  async getMovements(tenantId: string, productId: string) {
    return this.prisma.inventoryMovement.findMany({
      where: { tenantId, inventoryItem: { productId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMovementsForProduct(productId: string, tenantId: string) {
    return this.getMovements(tenantId, productId);
  }
}
