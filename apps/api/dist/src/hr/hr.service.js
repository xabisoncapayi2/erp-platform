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
const client_1 = require("@prisma/client");
let HrService = class HrService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateAccruedLeave(startDate) {
        const now = new Date();
        const monthsWorked = (now.getFullYear() - startDate.getFullYear()) * 12 +
            (now.getMonth() - startDate.getMonth());
        return Math.max(0, Math.floor(monthsWorked * 1.25));
    }
    async requestLeave(tenantId, dto) {
        const employee = await this.prisma.employee.findFirst({
            where: { id: dto.employeeId, tenantId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee ${dto.employeeId} not found`);
        }
        return this.prisma.leaveRequest.create({
            data: {
                tenantId,
                employeeId: dto.employeeId,
                leaveType: dto.leaveType,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                daysRequested: dto.daysRequested,
                status: client_1.LeaveStatus.PENDING,
            },
        });
    }
    async processLeaveApproval(tenantId, leaveRequestId, approved, approverId) {
        const leaveRequest = await this.prisma.leaveRequest.findFirst({
            where: { id: leaveRequestId, tenantId },
            include: { employee: true },
        });
        if (!leaveRequest) {
            throw new common_1.NotFoundException(`Leave request ${leaveRequestId} not found`);
        }
        if (leaveRequest.status !== client_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException(`Leave request is already processed`);
        }
        const newStatus = approved ? client_1.LeaveStatus.APPROVED : client_1.LeaveStatus.REJECTED;
        return this.prisma.$transaction(async (tx) => {
            if (approved) {
                await tx.employee.update({
                    where: { id: leaveRequest.employeeId },
                    data: {
                        leaveBalance: { decrement: leaveRequest.daysRequested },
                    },
                });
            }
            return tx.leaveRequest.update({
                where: { id: leaveRequestId },
                data: {
                    status: newStatus,
                    approvedById: approverId,
                    processedAt: new Date(),
                },
            });
        });
    }
};
exports.HrService = HrService;
exports.HrService = HrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HrService);
//# sourceMappingURL=hr.service.js.map