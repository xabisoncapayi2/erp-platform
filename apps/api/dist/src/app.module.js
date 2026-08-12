"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const purchase_orders_module_1 = require("./purchase-orders/purchase-orders.module");
const sales_orders_module_1 = require("./sales-orders/sales-orders.module");
const stock_transfers_module_1 = require("./stock-transfers/stock-transfers.module");
const general_ledger_module_1 = require("./general-ledger/general-ledger.module");
const analytics_module_1 = require("./analytics/analytics.module");
const supplier_invoices_module_1 = require("./supplier-invoices/supplier-invoices.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            sales_orders_module_1.SalesOrdersModule,
            stock_transfers_module_1.StockTransfersModule,
            general_ledger_module_1.GeneralLedgerModule,
            analytics_module_1.AnalyticsModule,
            supplier_invoices_module_1.SupplierInvoicesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map