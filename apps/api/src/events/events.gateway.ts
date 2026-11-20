import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract JWT from handshake auth payload, headers, or token query
      const rawToken =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization ||
        (client.handshake.query?.token as string);

      if (!rawToken) {
        this.logger.warn(`WS Rejected: Missing authorization token for client ${client.id}`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      const token = rawToken.replace(/^Bearer\s+/i, '');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secret',
      });

      if (!payload || !payload.tenantId) {
        this.logger.warn(`WS Rejected: Token missing tenantId payload for client ${client.id}`);
        client.emit('error', { message: 'Invalid tenant payload' });
        client.disconnect();
        return;
      }

      // Store verified auth context on socket
      client.data.user = payload;
      client.data.tenantId = payload.tenantId;

      // Join room isolated exclusively to the verified tenantId
      const tenantRoom = `tenant:${payload.tenantId}`;
      await client.join(tenantRoom);

      this.logger.log(`WS Client ${client.id} securely connected to ${tenantRoom}`);
    } catch (err: any) {
      this.logger.error(`WS Authentication error for ${client.id}: ${err.message}`);
      client.emit('error', { message: 'Invalid or expired token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WS Client disconnected: ${client.id}`);
  }
}
