import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { EventBusService } from "../events/event-bus.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/ws/notifications",
})
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit() {
    // Bridge internal RxJS EventBus events to WebSocket clients
    this.eventBus.ofType().subscribe((evt) => {
      const tenantRoom = `tenant:${evt.tenantId}`;

      // Broadcast to tenant room
      this.server.to(tenantRoom).emit("system_event", evt);
      this.server.to(tenantRoom).emit(evt.name, evt.payload);

      // Target specific user if userId is specified in payload
      if (evt.payload && evt.payload.userId) {
        const userRoom = `user:${evt.payload.userId}`;
        this.server.to(userRoom).emit("user_notification", evt);
      }

      this.logger.log(`[WS Broadcast] Event: ${evt.name} -> Room: ${tenantRoom}`);
    });
  }

  handleConnection(client: Socket) {
    const tenantId = (client.handshake.query.tenantId as string) || "default-tenant";
    const userId = (client.handshake.query.userId as string) || "system";

    client.join(`tenant:${tenantId}`);
    client.join(`user:${userId}`);

    this.logger.log(`[WS Client Connected] ID: ${client.id} (Tenant: ${tenantId}, User: ${userId})`);

    client.emit("connected", {
      status: "online",
      socketId: client.id,
      tenantId,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[WS Client Disconnected] ID: ${client.id}`);
  }

  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    return { event: "pong", data: { ...data, serverTime: new Date().toISOString() } };
  }
}
