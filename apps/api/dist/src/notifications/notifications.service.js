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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async notify(dto) {
        return this.create(dto);
    }
    async create(dto) {
        return this.prisma.notification.create({
            data: {
                tenantId: dto.tenantId,
                userId: dto.userId ?? "system",
                title: dto.title ?? (dto.type || "System Alert"),
                message: dto.message,
                type: dto.type ?? "INFO",
                metadata: dto.metadata ?? {},
            },
        });
    }
    async findAll(tenantId, userId, unreadOnly) {
        const where = { tenantId, userId };
        if (unreadOnly)
            where.read = false;
        return this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 50,
        });
    }
    async markAsRead(id, tenantId, userId) {
        return this.prisma.notification.updateMany({
            where: { id, tenantId, userId },
            data: { read: true },
        });
    }
    async markAllAsRead(tenantId, userId) {
        return this.prisma.notification.updateMany({
            where: { tenantId, userId, read: false },
            data: { read: true },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map