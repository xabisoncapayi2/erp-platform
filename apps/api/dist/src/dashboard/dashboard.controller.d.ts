import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(tenantId: string, role?: string): Promise<{
        period: string;
        sales: {
            totalRevenue: number;
            invoiceCount: number;
            topProducts: {
                productId: string;
                productName: string;
                sku: string;
                totalQuantity: number;
                totalQuantitySold: number;
                totalRevenue: number;
            }[];
        };
        inventory: {
            totalValue: number;
            byWarehouse: {
                warehouseId: string;
                warehouseName: string;
                itemCount: number;
                totalQuantity: number;
                totalValuation: number;
                totalValue: number;
            }[];
            lowStockAlertCount: number;
        };
        approvals: {
            pendingCount: number;
            pending: {
                id: string;
                tenantId: string;
                status: import(".prisma/client").$Enums.ApprovalStatus;
                createdAt: Date;
                entityType: import(".prisma/client").$Enums.ApprovableEntity;
                entityId: string;
                reason: string | null;
                requestedById: string;
                approverRoleRequired: string;
                decidedById: string | null;
                decidedAt: Date | null;
                decisionNote: string | null;
            }[];
        };
        accounting: {
            ledgerBalanced: boolean;
            totalDebits: number;
            totalCredits: number;
        };
    }>;
}
