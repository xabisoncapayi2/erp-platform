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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const microservices_2 = require("@nestjs/microservices");
let NotificationConsumer = class NotificationConsumer {
    handleNotification(data) {
        console.log(`[notifications-worker] Dispatching event: [${data.type}] ${data.message}`);
    }
};
__decorate([
    (0, microservices_2.EventPattern)('notification_created'),
    __param(0, (0, microservices_2.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationConsumer.prototype, "handleNotification", null);
NotificationConsumer = __decorate([
    (0, common_1.Controller)()
], NotificationConsumer);
let NotificationsWorkerModule = class NotificationsWorkerModule {
};
NotificationsWorkerModule = __decorate([
    (0, common_1.Module)({ controllers: [NotificationConsumer] })
], NotificationsWorkerModule);
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(NotificationsWorkerModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
            queue: 'notifications_queue',
            queueOptions: { durable: true },
        },
    });
    await app.listen();
    console.log('Notifications worker listening on RabbitMQ...');
}
bootstrap();
//# sourceMappingURL=main.js.map