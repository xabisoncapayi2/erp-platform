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
exports.HrService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HrService = class HrService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEmployee(tenantId, dto) {
        return this.prisma.employee.create({
            data: {
                tenantId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                department: dto.department,
                position: dto.position,
                salary: Number(dto.salary),
                status: dto.status || "ACTIVE",
            },
        });
    }
    async getEmployees(tenantId) {
        return this.prisma.employee.findMany({
            where: { tenantId },
            include: { payrolls: true },
        });
    }
    async getEmployeeById(tenantId, id) {
        const emp = await this.prisma.employee.findFirst({
            where: { id, tenantId },
            include: { payrolls: true },
        });
        if (!emp)
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        return emp;
    }
    async processPayroll(tenantId, dto) {
        const gross = Number(dto.grossPay);
        const deductions = Number(dto.deductions || 0);
        const netPay = gross - deductions;
        return this.prisma.payrollRecord.create({
            data: {
                tenantId,
                employeeId: dto.employeeId,
                payPeriod: dto.payPeriod,
                grossPay: gross,
                deductions,
                netPay,
                status: dto.status || "PROCESSED",
            },
        });
    }
    async getPayrollRecords(tenantId) {
        return this.prisma.payrollRecord.findMany({
            where: { tenantId },
            include: { employee: true },
        });
    }
};
exports.HrService = HrService;
exports.HrService = HrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HrService);
//# sourceMappingURL=hr.service.js.map