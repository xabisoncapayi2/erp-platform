"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierInvoicesModule = void 0;
const supplier_invoices_controller_1 = require("./supplier-invoices.controller");
const common_1 = require("@nestjs/common");
const supplier_invoices_service_1 = require("./supplier-invoices.service");
const prisma_module_1 = require("../prisma/prisma.module");
let SupplierInvoicesModule = class SupplierInvoicesModule {
};
exports.SupplierInvoicesModule = SupplierInvoicesModule;
exports.SupplierInvoicesModule = SupplierInvoicesModule = __decorate([
    (0, common_1.Module)({
        controllers: [supplier_invoices_controller_1.SupplierInvoicesController],
        imports: [prisma_module_1.PrismaModule],
        providers: [supplier_invoices_service_1.SupplierInvoicesService],
        exports: [supplier_invoices_service_1.SupplierInvoicesService],
    })
], SupplierInvoicesModule);
//# sourceMappingURL=supplier-invoices.module.js.map