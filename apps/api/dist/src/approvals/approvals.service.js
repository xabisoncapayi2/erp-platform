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
exports.ApprovalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ApprovalsService = class ApprovalsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRequest(params) {
        const existing = await this.prisma.approvalRequest.findFirst({
            where: {
                tenantId: params.tenantId,
                entityType: params.entityType,
                entityId: params.entityId,
                status: client_1.ApprovalStatus.PENDING,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`An approval request is already pending for this ${params.entityType}.`);
        }
        return this.prisma.approvalRequest.create({ data: params });
    }
    async decide(requestId, tenantId, decidedById, approverRoles, decision, decisionNote) {
        const request = await this.prisma.approvalRequest.findFirst({
            where: { id: requestId, tenantId },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Approval request ${requestId} not found.`);
        }
        if (request.status !== client_1.ApprovalStatus.PENDING) {
            throw new common_1.BadRequestException(`Approval request is already ${request.status}, cannot decide again.`);
        }
        if (!approverRoles.includes(request.approverRoleRequired)) {
            throw new common_1.ForbiddenException(`You do not hold the required role (${request.approverRoleRequired}) to decide this request.`);
        }
        if (request.requestedById === decidedById) {
            throw new common_1.ForbiddenException('You cannot approve your own request.');
        }
        return this.prisma.approvalRequest.update({
            where: { id: requestId },
            data: {
                status: decision,
                decidedById,
                decidedAt: new Date(),
                decisionNote,
            },
        });
    }
    async getPendingForRole(tenantId, role) {
        return this.prisma.approvalRequest.findMany({
            where: { tenantId, status: client_1.ApprovalStatus.PENDING, approverRoleRequired: role },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.ApprovalsService = ApprovalsService;
exports.ApprovalsService = ApprovalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApprovalsService);
//# sourceMappingURL=approvals.service.js.map