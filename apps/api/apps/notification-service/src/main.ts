import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Module, Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
class NotificationConsumerController {
  @EventPattern('stock.low')
  handleStockLowAlert(@Payload() data: Record<string, any>) {
    console.log(`[ALERT] Low Stock Notification: Product ${data.productId} has ${data.currentStock} units left.`);
  }

  @EventPattern('po.approved')
  handlePOApproved(@Payload() data: Record<string, any>) {
    console.log(`[NOTIFICATION] Purchase Order ${data.poId} approved for R${data.totalAmount}.`);
  }
}

@Module({
  controllers: [NotificationConsumerController],
})
class NotificationMicroserviceModule {}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationMicroserviceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'erp_notifications_queue',
        queueOptions: { durable: true },
      },
    },
  );
  await app.listen();
  console.log('🚀 Notification Microservice listening on RabbitMQ queue');
}
bootstrap();
