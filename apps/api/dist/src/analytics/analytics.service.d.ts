import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardMetrics(tenantId: string): Promise<{
        totalSales: number;
        totalPOs: number;
    }>;
    getMonthlySales(tenantId: string, year?: number, month?: number): Promise<{
        invoiceCount: number;
        totalRevenue: number;
    }>;
    getTopSellingProducts(tenantId: string): Promise<{
        productId: string;
        totalQuantitySold: number;
        totalRevenue: number;
    }[]>;
    getInventoryValuationByWarehouse(tenantId: string): Promise<{
        warehouseId: string;
        totalValue: number;
    }[]>;
}
