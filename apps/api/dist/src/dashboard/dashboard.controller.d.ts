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
                totalQuantitySold: number;
                totalRevenue: number;
            }[];
        };
        inventory: {
            totalValue: number;
            byWarehouse: {
                warehouseId: string;
                totalValue: number;
            }[];
            lowStockAlertCount: number;
        };
        approvals: {
            pendingCount: number;
            pending: {
                id: string;
                createdAt: Date;
                tenantId: string;
                entityType: import(".prisma/client").$Enums.ApprovableEntity;
                entityId: string;
                status: import(".prisma/client").$Enums.ApprovalStatus;
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
