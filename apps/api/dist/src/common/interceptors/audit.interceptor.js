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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, user, headers } = req;
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            const tenantId = headers['x-tenant-id'] || user?.tenantId;
            const userId = user?.id || user?.sub || 'system';
            const entity = url.split('/')[1]?.split('?')[0] || 'unknown';
            return next.handle().pipe((0, operators_1.tap)(async (responseData) => {
                if (tenantId) {
                    await this.prisma.auditLog.create({
                        data: {
                            tenantId,
                            userId,
                            action: `${method} ${url}`,
                            entity,
                            payload: {
                                requestBody: body,
                                responseSummary: responseData?.id ? { id: responseData.id } : 'success',
                            },
                        },
                    });
                }
            }));
        }
        return next.handle();
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map