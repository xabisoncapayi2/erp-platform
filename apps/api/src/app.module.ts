import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { SalesOrdersModule } from './sales-orders/sales-orders.module';
import { StockTransfersModule } from './stock-transfers/stock-transfers.module';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupplierInvoicesModule } from './supplier-invoices/supplier-invoices.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    PurchaseOrdersModule,
    SalesOrdersModule,
    StockTransfersModule,
    GeneralLedgerModule,
    AnalyticsModule,
    SupplierInvoicesModule,
  ],
})
export class AppModule {}
