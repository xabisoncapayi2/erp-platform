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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierInvoicesController = void 0;
const common_1 = require("@nestjs/common");
const supplier_invoices_service_1 = require("./supplier-invoices.service");
let SupplierInvoicesController = class SupplierInvoicesController {
    constructor(supplierInvoicesService) {
        this.supplierInvoicesService = supplierInvoicesService;
    }
    create(tenantId, dto) {
        return this.supplierInvoicesService.create(tenantId, {
            ...dto,
            dueDate: new Date(dto.dueDate),
        });
    }
    approve(tenantId, id) {
        return this.supplierInvoicesService.approve(id, tenantId);
    }
    reject(tenantId, id, body) {
        return this.supplierInvoicesService.reject(id, tenantId, body.reason);
    }
};
exports.SupplierInvoicesController = SupplierInvoicesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SupplierInvoicesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SupplierInvoicesController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SupplierInvoicesController.prototype, "reject", null);
exports.SupplierInvoicesController = SupplierInvoicesController = __decorate([
    (0, common_1.Controller)('supplier-invoices'),
    __metadata("design:paramtypes", [supplier_invoices_service_1.SupplierInvoicesService])
], SupplierInvoicesController);
//# sourceMappingURL=supplier-invoices.controller.js.map