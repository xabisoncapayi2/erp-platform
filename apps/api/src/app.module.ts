import { NotificationsModule } from "./notifications/notifications.module";
import { EventsModule } from "./events/events.module";
import { AuditLogsModule } from "./audit-logs/audit-logs.module";
import { HrModule } from "./hr/hr.module";
import { Module } from "@nestjs/common";
import { AnalyticsModule } from "./analytics/analytics.module";
import { ApprovalsModule } from "./approvals/approvals.module";
import { AuthModule } from "./auth/auth.module";
import { GeneralLedgerModule } from "./general-ledger/general-ledger.module";
import { InventoryModule } from "./inventory/inventory.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { PurchaseOrdersModule } from "./purchase-orders/purchase-orders.module";
import { SalesOrdersModule } from "./sales-orders/sales-orders.module";
import { StockTransfersModule } from "./stock-transfers/stock-transfers.module";
import { SupplierInvoicesModule } from "./supplier-invoices/supplier-invoices.module";
import { SuppliersModule } from "./suppliers/suppliers.module";

@Module({
  imports: [
    NotificationsModule,
    EventsModule,
    AuditLogsModule,
    HrModule,
    AnalyticsModule,
    ApprovalsModule,
    AuthModule,
    GeneralLedgerModule,
    InventoryModule,
    PrismaModule,
    ProductsModule,
    PurchaseOrdersModule,
    SalesOrdersModule,
    StockTransfersModule,
    SupplierInvoicesModule,
    SuppliersModule
  ],
})
export class AppModule {}
