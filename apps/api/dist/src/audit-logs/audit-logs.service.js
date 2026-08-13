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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditLogsService = class AuditLogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(dto) {
        return this.prisma.auditLog.create({
            data: {
                tenantId: dto.tenantId,
                userId: dto.userId,
                userEmail: dto.userEmail,
                action: dto.action,
                entity: dto.entity,
                entityId: dto.entityId,
                details: dto.details ?? {},
                ipAddress: dto.ipAddress,
                userAgent: dto.userAgent,
            },
        });
    }
    async findAll(tenantId, options) {
        const where = { tenantId };
        if (options?.entity)
            where.entity = options.entity;
        if (options?.action)
            where.action = options.action;
        return this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: options?.limit || 100,
        });
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map