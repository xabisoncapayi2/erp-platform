import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class NotificationPublisherService implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'erp_notifications_queue',
        queueOptions: { durable: true },
      },
    });
  }

  async emitStockAlert(tenantId: string, productId: string, currentStock: number) {
    return this.client.emit('stock.low', {
      tenantId,
      productId,
      currentStock,
      timestamp: new Date().toISOString(),
    });
  }

  async emitPOApproved(tenantId: string, poId: string, totalAmount: number) {
    return this.client.emit('po.approved', {
      tenantId,
      poId,
      totalAmount,
      timestamp: new Date().toISOString(),
    });
  }
}
