import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '') ||
      client.handshake.query?.token;

    if (!token || typeof token !== 'string') {
      this.logger.warn(`[WS] Rejected connection with no token: ${client.id}`);
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'dev-only-change-me',
      });

      client.data.tenantId = payload.tenantId;
      client.data.userId = payload.sub || payload.userId;

      client.join(`tenant:${payload.tenantId}`);
      client.join(`user:${client.data.userId}`);

      this.logger.log(
        `[WS Connected] ID: ${client.id} (Tenant: ${payload.tenantId}, User: ${client.data.userId})`,
      );

      client.emit('connected', {
        status: 'online',
        socketId: client.id,
        tenantId: payload.tenantId,
        userId: client.data.userId,
        timestamp: new Date().toISOString(),
      });
    } catch {
      this.logger.warn(`[WS] Rejected connection with invalid token: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[WS Disconnected] ID: ${client.id}`);
  }

  sendToTenant(tenantId: string, event: string, data: any) {
    this.server.to(`tenant:${tenantId}`).emit(event, data);
  }

  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
