import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { EventsModule } from './events/events.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { HrModule } from './hr/hr.module';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { SalesOrdersModule } from './sales-orders/sales-orders.module';
import { StockTransfersModule } from './stock-transfers/stock-transfers.module';
import { SupplierInvoicesModule } from './supplier-invoices/supplier-invoices.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    EventsModule,
    ProductsModule,
    InventoryModule,
    HrModule,
    GeneralLedgerModule,
    AnalyticsModule,
    SuppliersModule,
    PurchaseOrdersModule,
    SalesOrdersModule,
    StockTransfersModule,
    SupplierInvoicesModule,
    AuditLogsModule,
    ApprovalsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
