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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EmployeesService = class EmployeesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(tenantId, dto) {
        return this.prisma.employee.create({ data: { tenantId, ...dto } });
    }
    async requestLeave(tenantId, dto) {
        const employee = await this.prisma.employee.findFirst({
            where: { id: dto.employeeId, tenantId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee ${dto.employeeId} not found.`);
        }
        if (dto.endDate < dto.startDate) {
            throw new common_1.BadRequestException('endDate cannot be before startDate.');
        }
        const days = Math.ceil((dto.endDate.getTime() - dto.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return this.prisma.leaveRequest.create({
            data: {
                tenantId,
                employeeId: dto.employeeId,
                startDate: dto.startDate,
                endDate: dto.endDate,
                reason: dto.reason,
                status: client_1.LeaveStatus.PENDING,
            },
        });
    }
    async decideLeave(tenantId, leaveId, decision) {
        const leave = await this.prisma.leaveRequest.findFirst({ where: { id: leaveId, tenantId } });
        if (!leave) {
            throw new common_1.NotFoundException(`Leave request ${leaveId} not found.`);
        }
        if (leave.status !== client_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException(`Leave request is already ${leave.status}.`);
        }
        return this.prisma.leaveRequest.update({
            where: { id: leaveId },
            data: { status: decision },
        });
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map