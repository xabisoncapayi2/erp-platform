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
exports.HrController = void 0;
const common_1 = require("@nestjs/common");
const hr_service_1 = require("./hr.service");
let HrController = class HrController {
    constructor(service) {
        this.service = service;
    }
    async createEmployee(tenantHeader, dto) {
        return this.service.createEmployee(tenantHeader || "default-tenant", dto || {});
    }
    async getEmployees(tenantHeader) {
        return this.service.getEmployees(tenantHeader || "default-tenant");
    }
    async getEmployeeById(tenantHeader, id) {
        return this.service.getEmployeeById(tenantHeader || "default-tenant", id || "");
    }
    async processPayroll(tenantHeader, dto) {
        return this.service.processPayroll(tenantHeader || "default-tenant", dto || {});
    }
    async getPayrollRecords(tenantHeader) {
        return this.service.getPayrollRecords(tenantHeader || "default-tenant");
    }
};
exports.HrController = HrController;
__decorate([
    (0, common_1.Post)("employees"),
    __param(0, (0, common_1.Headers)("x-tenant-id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HrController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Get)("employees"),
    __param(0, (0, common_1.Headers)("x-tenant-id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HrController.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)("employees/:id"),
    __param(0, (0, common_1.Headers)("x-tenant-id")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HrController.prototype, "getEmployeeById", null);
__decorate([
    (0, common_1.Post)("payroll"),
    __param(0, (0, common_1.Headers)("x-tenant-id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HrController.prototype, "processPayroll", null);
__decorate([
    (0, common_1.Get)("payroll"),
    __param(0, (0, common_1.Headers)("x-tenant-id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HrController.prototype, "getPayrollRecords", null);
exports.HrController = HrController = __decorate([
    (0, common_1.Controller)("hr"),
    __metadata("design:paramtypes", [hr_service_1.HrService])
], HrController);
//# sourceMappingURL=hr.controller.js.map