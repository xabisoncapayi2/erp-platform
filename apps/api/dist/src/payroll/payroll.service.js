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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const SA_PAYROLL_CONFIGS = {
    '2025-2026': {
        uifCeilingMonthly: 17712,
        uifRate: 0.01,
        primaryRebateAnnual: 17235,
        brackets: [
            { from: 0, to: 237100, base: 0, rate: 0.18 },
            { from: 237100, to: 370500, base: 42678, rate: 0.26 },
            { from: 370500, to: 512800, base: 77362, rate: 0.31 },
            { from: 512800, to: 673000, base: 121475, rate: 0.36 },
            { from: 673000, to: 857900, base: 179147, rate: 0.39 },
            { from: 857900, to: 1817000, base: 251258, rate: 0.41 },
            { from: 1817000, to: Infinity, base: 644489, rate: 0.45 },
        ],
    },
    '2026-2027': {
        uifCeilingMonthly: 17712,
        uifRate: 0.01,
        primaryRebateAnnual: 17820,
        brackets: [
            { from: 0, to: 245100, base: 0, rate: 0.18 },
            { from: 245100, to: 383100, base: 44118, rate: 0.26 },
            { from: 383100, to: 530200, base: 80898, rate: 0.31 },
            { from: 530200, to: 695800, base: 126449, rate: 0.36 },
            { from: 695800, to: 887000, base: 186201, rate: 0.39 },
            { from: 887000, to: 1878600, base: 260805, rate: 0.41 },
            { from: 1878600, to: Infinity, base: 668729, rate: 0.45 },
        ],
    },
};
function getTaxYearForPeriod(period) {
    const [yearStr, monthStr] = period.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const taxYearStart = month >= 3 ? year : year - 1;
    const key = `${taxYearStart}-${taxYearStart + 1}`;
    if (!(key in SA_PAYROLL_CONFIGS)) {
        throw new common_1.BadRequestException(`No payroll config for tax year ${key} (period ${period}). Add it to SA_PAYROLL_CONFIGS.`);
    }
    return key;
}
function calculateSAPayroll(grossMonthlySalary, period) {
    const cfg = SA_PAYROLL_CONFIGS[getTaxYearForPeriod(period)];
    const uifableEarnings = Math.min(grossMonthlySalary, cfg.uifCeilingMonthly);
    const uifAmount = Number((uifableEarnings * cfg.uifRate).toFixed(2));
    const annualSalary = grossMonthlySalary * 12;
    const bracket = cfg.brackets.find((b) => annualSalary > b.from && annualSalary <= b.to) ??
        cfg.brackets[cfg.brackets.length - 1];
    const annualTaxBeforeRebate = bracket.base + (annualSalary - bracket.from) * bracket.rate;
    const annualTaxAfterRebate = Math.max(0, annualTaxBeforeRebate - cfg.primaryRebateAnnual);
    const paye = Number((annualTaxAfterRebate / 12).toFixed(2));
    const netSalary = Number((grossMonthlySalary - paye - uifAmount).toFixed(2));
    return { paye, uifEmployee: uifAmount, uifEmployer: uifAmount, netSalary };
}
let PayrollService = class PayrollService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async runPayrollForEmployee(tenantId, employeeId, period) {
        const employee = await this.prisma.employee.findFirst({
            where: { id: employeeId, tenantId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee ${employeeId} not found.`);
        }
        const existing = await this.prisma.paySlip.findFirst({
            where: { tenantId, employeeId, period },
        });
        if (existing) {
            throw new common_1.BadRequestException(`A payslip for ${employee.firstName} ${employee.lastName} already exists for ${period}.`);
        }
        const calc = calculateSAPayroll(Number(employee.grossSalary ?? 0), period);
        return this.prisma.paySlip.create({
            data: {
                tenantId,
                employeeId,
                period,
                grossSalary: employee.grossSalary ?? 0,
                tax: calc.paye,
                uifEmployee: calc.uifEmployee,
                uifEmployer: calc.uifEmployer,
                netSalary: calc.netSalary,
            },
        });
    }
    async runPayrollForAllEmployees(tenantId, period) {
        const employees = await this.prisma.employee.findMany({ where: { tenantId } });
        const results = [];
        for (const emp of employees) {
            try {
                const slip = await this.runPayrollForEmployee(tenantId, emp.id, period);
                results.push({ employeeId: emp.id, status: 'success', paySlip: slip });
            }
            catch (err) {
                results.push({ employeeId: emp.id, status: 'skipped', reason: err.message });
            }
        }
        return results;
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map