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
