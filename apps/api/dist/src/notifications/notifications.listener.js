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
exports.NotificationsListener = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../events/event-bus.service");
const notifications_service_1 = require("./notifications.service");
let NotificationsListener = class NotificationsListener {
    constructor(eventBus, notificationsService) {
        this.eventBus = eventBus;
        this.notificationsService = notificationsService;
    }
    onModuleInit() {
        this.eventBus.on("order.created").subscribe(async (evt) => {
            await this.notificationsService.create({
                tenantId: evt.tenantId,
                userId: evt.payload.userId || "admin",
                title: "New Sales Order",
                message: `Order #${evt.payload.orderId || evt.payload.id || "N/A"} was created.`,
                type: "INFO",
                metadata: evt.payload,
            });
        });
        this.eventBus.on("stock.low").subscribe(async (evt) => {
            await this.notificationsService.create({
                tenantId: evt.tenantId,
                userId: evt.payload.userId || "inventory-manager",
                title: "Low Stock Alert",
                message: `Item ${evt.payload.sku} is below threshold (${evt.payload.currentQuantity} remaining).`,
                type: "WARNING",
                metadata: evt.payload,
            });
        });
        this.eventBus.on("approval.requested").subscribe(async (evt) => {
            await this.notificationsService.create({
                tenantId: evt.tenantId,
                userId: evt.payload.approverId || "approver",
                title: "Approval Required",
                message: `Approval requested for ${evt.payload.entity} #${evt.payload.entityId}.`,
                type: "WARNING",
                metadata: evt.payload,
            });
        });
    }
};
exports.NotificationsListener = NotificationsListener;
exports.NotificationsListener = NotificationsListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_bus_service_1.EventBusService,
        notifications_service_1.NotificationsService])
], NotificationsListener);
//# sourceMappingURL=notifications.listener.js.map