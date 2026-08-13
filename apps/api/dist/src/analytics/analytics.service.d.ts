import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardMetrics(tenantId: string): Promise<{
        totalRevenue: number;
        totalOrders: number;
        fulfilledOrdersCount: number;
        pendingOrdersCount: number;
        inventoryValuation: number;
        totalStockQuantity: number;
        totalProducts: number;
        lowStockCount: number;
    }>;
    getMonthlySales(tenantId: string, year?: string | number, month?: string | number): Promise<{
        year: number;
        month: number;
        monthName: string;
        totalSales: number;
        orderCount: number;
    }[] & {
        totalRevenue: number;
        invoiceCount: number;
    }>;
    getTopSellingProducts(tenantId: string, limit?: number): Promise<{
        productId: string;
        productName: string;
        sku: string;
        totalQuantity: number;
        totalQuantitySold: number;
        totalRevenue: number;
    }[]>;
    getInventoryValuationByWarehouse(tenantId: string): Promise<{
        warehouseId: string;
        warehouseName: string;
        itemCount: number;
        totalQuantity: number;
        totalValuation: number;
        totalValue: number;
    }[]>;
}
