import { OnModuleInit } from "@nestjs/common";
import { EventBusService } from "../events/event-bus.service";
import { NotificationsService } from "./notifications.service";
export declare class NotificationsListener implements OnModuleInit {
    private readonly eventBus;
    private readonly notificationsService;
    constructor(eventBus: EventBusService, notificationsService: NotificationsService);
    onModuleInit(): void;
}
