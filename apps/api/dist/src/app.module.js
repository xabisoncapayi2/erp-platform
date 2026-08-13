"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const notifications_module_1 = require("./notifications/notifications.module");
const events_module_1 = require("./events/events.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const hr_module_1 = require("./hr/hr.module");
const common_1 = require("@nestjs/common");
const analytics_module_1 = require("./analytics/analytics.module");
const approvals_module_1 = require("./approvals/approvals.module");
const auth_module_1 = require("./auth/auth.module");
const general_ledger_module_1 = require("./general-ledger/general-ledger.module");
const inventory_module_1 = require("./inventory/inventory.module");
const prisma_module_1 = require("./prisma/prisma.module");
const products_module_1 = require("./products/products.module");
const purchase_orders_module_1 = require("./purchase-orders/purchase-orders.module");
const sales_orders_module_1 = require("./sales-orders/sales-orders.module");
const stock_transfers_module_1 = require("./stock-transfers/stock-transfers.module");
const supplier_invoices_module_1 = require("./supplier-invoices/supplier-invoices.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notifications_module_1.NotificationsModule,
            events_module_1.EventsModule,
            audit_logs_module_1.AuditLogsModule,
            hr_module_1.HrModule,
            analytics_module_1.AnalyticsModule,
            approvals_module_1.ApprovalsModule,
            auth_module_1.AuthModule,
            general_ledger_module_1.GeneralLedgerModule,
            inventory_module_1.InventoryModule,
            prisma_module_1.PrismaModule,
            products_module_1.ProductsModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            sales_orders_module_1.SalesOrdersModule,
            stock_transfers_module_1.StockTransfersModule,
            supplier_invoices_module_1.SupplierInvoicesModule,
            suppliers_module_1.SuppliersModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map