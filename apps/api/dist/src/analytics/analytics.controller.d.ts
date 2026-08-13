import { AnalyticsService } from "./analytics.service";
export declare class AnalyticsController {
    private readonly service;
    constructor(service: AnalyticsService);
    getDashboardMetrics(tenantHeader?: string): Promise<{
        totalRevenue: number;
        totalOrders: number;
        fulfilledOrdersCount: number;
        pendingOrdersCount: number;
        inventoryValuation: number;
        totalStockQuantity: number;
        totalProducts: number;
        lowStockCount: number;
    }>;
    getMonthlySales(tenantHeader?: string, year?: string, month?: string): Promise<{
        year: number;
        month: number;
        monthName: string;
        totalSales: number;
        orderCount: number;
    }[] & {
        totalRevenue: number;
        invoiceCount: number;
    }>;
    getTopSellingProducts(tenantHeader?: string, limit?: string): Promise<{
        productId: string;
        productName: string;
        sku: string;
        totalQuantity: number;
        totalQuantitySold: number;
        totalRevenue: number;
    }[]>;
    getInventoryValuationByWarehouse(tenantHeader?: string): Promise<{
        warehouseId: string;
        warehouseName: string;
        itemCount: number;
        totalQuantity: number;
        totalValuation: number;
        totalValue: number;
    }[]>;
}
