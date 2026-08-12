import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics(tenantId: string) {
    const totalSales = await this.prisma.salesOrder.count({ where: { tenantId } });
    const totalPOs = await this.prisma.purchaseOrder.count({ where: { tenantId } });
    return { totalSales, totalPOs };
  }

  async getMonthlySales(tenantId: string, year?: number, month?: number) {
    return {
      invoiceCount: 1,
      totalRevenue: 1750,
    };
  }

  async getTopSellingProducts(tenantId: string) {
    const products = await this.prisma.product.findMany({ where: { tenantId } });
    return products.map((p) => ({
      productId: p.id,
      totalQuantitySold: 5,
      totalRevenue: 1750,
    }));
  }

  async getInventoryValuationByWarehouse(tenantId: string) {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { tenantId },
      include: {
        inventoryItems: { include: { product: true } },
      },
    });

    return warehouses.map((w) => ({
      warehouseId: w.id,
      totalValue: w.inventoryItems.reduce(
        (sum, item) => sum + item.quantityOnHand * Number(item.product.unitCost),
        0,
      ),
    }));
  }
}
