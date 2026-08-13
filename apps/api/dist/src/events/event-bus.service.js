"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ioredis_1 = require("ioredis");
let EventBusService = class EventBusService {
    constructor() {
        this.subject$ = new rxjs_1.Subject();
    }
    onModuleInit() {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = Number(process.env.REDIS_PORT) || 6379;
        this.redisPublisher = new ioredis_1.default({ host: redisHost, port: redisPort, lazyConnect: true });
        this.redisSubscriber = new ioredis_1.default({ host: redisHost, port: redisPort, lazyConnect: true });
        this.redisPublisher.connect().catch(() => {
        });
        this.redisSubscriber
            .connect()
            .then(() => {
            this.redisSubscriber.subscribe('erp:system:events');
            this.redisSubscriber.on('message', (channel, message) => {
                if (channel === 'erp:system:events') {
                    try {
                        const event = JSON.parse(message);
                        this.subject$.next(event);
                    }
                    catch (e) { }
                }
            });
        })
            .catch(() => { });
    }
    onModuleDestroy() {
        this.redisPublisher?.disconnect();
        this.redisSubscriber?.disconnect();
    }
    emit(name, tenantId, payload) {
        const event = {
            name,
            tenantId,
            payload,
            timestamp: new Date().toISOString(),
        };
        this.subject$.next(event);
        if (this.redisPublisher && this.redisPublisher.status === 'ready') {
            this.redisPublisher.publish('erp:system:events', JSON.stringify(event));
        }
    }
    on(eventName, tenantId) {
        return this.subject$.asObservable().pipe((0, operators_1.filter)((evt) => {
            const matchesEvent = !eventName || evt.name === eventName;
            const matchesTenant = !tenantId || evt.tenantId === tenantId;
            return matchesEvent && matchesTenant;
        }));
    }
    ofType(eventName) {
        return this.on(eventName);
    }
};
exports.EventBusService = EventBusService;
exports.EventBusService = EventBusService = __decorate([
    (0, common_1.Injectable)()
], EventBusService);
//# sourceMappingURL=event-bus.service.js.map