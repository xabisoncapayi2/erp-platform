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
var LowStockCheckJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowStockCheckJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let LowStockCheckJob = LowStockCheckJob_1 = class LowStockCheckJob {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(LowStockCheckJob_1.name);
    }
    async checkLowStock() {
        this.logger.log('Running nightly low-stock check...');
        const items = await this.prisma.inventoryItem.findMany({
            include: { product: true, warehouse: true },
        });
        const lowStockItems = items.filter((item) => item.quantityOnHand < item.reorderLevel);
        for (const item of lowStockItems) {
            await this.notificationsService.notify({
                tenantId: item.tenantId,
                type: client_1.NotificationType.LOW_STOCK,
                message: `${item.product.name} is low in ${item.warehouse.name}: ` +
                    `${item.quantityOnHand} on hand, reorder level is ${item.reorderLevel}.`,
            });
        }
        this.logger.log(`Low-stock check complete: ${lowStockItems.length} alert(s) sent.`);
    }
};
exports.LowStockCheckJob = LowStockCheckJob;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LowStockCheckJob.prototype, "checkLowStock", null);
exports.LowStockCheckJob = LowStockCheckJob = LowStockCheckJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], LowStockCheckJob);
//# sourceMappingURL=low-stock-check.job.js.map