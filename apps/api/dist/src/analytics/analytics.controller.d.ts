import { AnalyticsService } from "./analytics.service";
export declare class AnalyticsController {
    private readonly service;
    constructor(service: AnalyticsService);
    getDashboardMetrics(tenantHeader?: string): Promise<{
        totalSales: number;
        totalPOs: number;
    }>;
    getMonthlySales(tenantHeader?: string, year?: any, month?: any): Promise<{
        invoiceCount: number;
        totalRevenue: number;
    }>;
    getTopSellingProducts(tenantHeader?: string): Promise<{
        productId: string;
        totalQuantitySold: number;
        totalRevenue: number;
    }[]>;
    getInventoryValuationByWarehouse(tenantHeader?: string): Promise<{
        warehouseId: string;
        totalValue: number;
    }[]>;
}
