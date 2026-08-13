"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const analytics_service_1 = require("../analytics/analytics.service");
const general_ledger_service_1 = require("../general-ledger/general-ledger.service");
const approvals_service_1 = require("../approvals/approvals.service");
let DashboardService = class DashboardService {
    constructor(prisma, analyticsService, glService, approvalsService) {
        this.prisma = prisma;
        this.analyticsService = analyticsService;
        this.glService = glService;
        this.approvalsService = approvalsService;
    }
    async getSummary(tenantId, approverRole) {
        const now = new Date();
        const [monthlySales, topProducts, inventoryValuation, pendingApprovals, trialBalance, lowStockCount,] = await Promise.all([
            this.analyticsService.getMonthlySales(tenantId, now.getFullYear(), now.getMonth() + 1),
            this.analyticsService.getTopSellingProducts(tenantId),
            this.analyticsService.getInventoryValuationByWarehouse(tenantId),
            this.approvalsService.getPendingForRole(tenantId, approverRole),
            this.glService.getTrialBalance(tenantId),
            this.prisma.inventoryItem
                .findMany({ where: { tenantId } })
                .then((items) => items.filter((i) => i.quantityOnHand < i.reorderLevel).length),
        ]);
        const totalInventoryValue = inventoryValuation.reduce((sum, w) => sum + w.totalValue, 0);
        const totalDebits = trialBalance.reduce((sum, a) => sum + a.debit, 0);
        const totalCredits = trialBalance.reduce((sum, a) => sum + a.credit, 0);
        return {
            period: "CURRENT_MONTH",
            sales: {
                totalRevenue: monthlySales.totalRevenue,
                invoiceCount: monthlySales.invoiceCount,
                topProducts,
            },
            inventory: {
                totalValue: totalInventoryValue,
                byWarehouse: inventoryValuation,
                lowStockAlertCount: lowStockCount,
            },
            approvals: {
                pendingCount: pendingApprovals.length,
                pending: pendingApprovals,
            },
            accounting: {
                ledgerBalanced: totalDebits === totalCredits,
                totalDebits,
                totalCredits,
            },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        analytics_service_1.AnalyticsService,
        general_ledger_service_1.GeneralLedgerService,
        approvals_service_1.ApprovalsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map