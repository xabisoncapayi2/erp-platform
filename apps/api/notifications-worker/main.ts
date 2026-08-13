import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Module, Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

interface NotificationEvent {
  id: string;
  tenantId: string;
  userId?: string;
  type: string;
  message: string;
}

@Controller()
class NotificationConsumer {
  @EventPattern('notification_created')
  handleNotification(@Payload() data: NotificationEvent) {
    console.log(`[notifications-worker] Dispatching event: [${data.type}] ${data.message}`);
  }
}

@Module({ controllers: [NotificationConsumer] })
class NotificationsWorkerModule {}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationsWorkerModule, {
    transport: Transport.RMQ,
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
