import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { GeneralLedgerService } from '../general-ledger/general-ledger.service';
import { ApprovalsService } from '../approvals/approvals.service';
export declare class DashboardService {
    private prisma;
    private analyticsService;
    private glService;
    private approvalsService;
    constructor(prisma: PrismaService, analyticsService: AnalyticsService, glService: GeneralLedgerService, approvalsService: ApprovalsService);
    getSummary(tenantId: string, approverRole: string): Promise<{
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
