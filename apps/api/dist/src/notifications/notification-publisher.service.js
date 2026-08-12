"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPublisherService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let NotificationPublisherService = class NotificationPublisherService {
    onModuleInit() {
        this.client = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                queue: 'erp_notifications_queue',
                queueOptions: { durable: true },
            },
        });
    }
    async emitStockAlert(tenantId, productId, currentStock) {
        return this.client.emit('stock.low', {
            tenantId,
            productId,
            currentStock,
            timestamp: new Date().toISOString(),
        });
    }
    async emitPOApproved(tenantId, poId, totalAmount) {
        return this.client.emit('po.approved', {
            tenantId,
            poId,
            totalAmount,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.NotificationPublisherService = NotificationPublisherService;
exports.NotificationPublisherService = NotificationPublisherService = __decorate([
    (0, common_1.Injectable)()
], NotificationPublisherService);
//# sourceMappingURL=notification-publisher.service.js.map