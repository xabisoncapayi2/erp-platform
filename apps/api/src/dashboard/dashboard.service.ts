import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { GeneralLedgerService } from '../general-ledger/general-ledger.service';
import { ApprovalsService } from '../approvals/approvals.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService,
    private glService: GeneralLedgerService,
    private approvalsService: ApprovalsService,
  ) {}

  async getSummary(tenantId: string, approverRole: string) {
    const now = new Date();

    const [
      monthlySales,
      topProducts,
      inventoryValuation,
      pendingApprovals,
      trialBalance,
      lowStockCount,
    ] = await Promise.all([
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
}
