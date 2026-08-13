import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnModuleInit } from "@nestjs/common";
import { EventBusService } from "../events/event-bus.service";
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private readonly eventBus;
    server: Server;
    private readonly logger;
    constructor(eventBus: EventBusService);
    onModuleInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handlePing(client: Socket, data: any): {
        event: string;
        data: any;
    };
}
