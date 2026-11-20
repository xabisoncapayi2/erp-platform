import { Injectable, OnModuleInit, OnModuleDestroy, BadRequestException } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import Redis from 'ioredis';

export interface SystemEvent {
  name: string;
  tenantId: string;
  payload: any;
  timestamp: string;
}

@Injectable()
export class EventBusService implements OnModuleInit, OnModuleDestroy {
  private subject$ = new Subject<SystemEvent>();
  private redisPublisher: Redis;
  private redisSubscriber: Redis;

  onModuleInit() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = Number(process.env.REDIS_PORT) || 6379;

    this.redisPublisher = new Redis({ host: redisHost, port: redisPort, lazyConnect: true });
    this.redisSubscriber = new Redis({ host: redisHost, port: redisPort, lazyConnect: true });

    this.redisPublisher.connect().catch(() => {});

    this.redisSubscriber
      .connect()
      .then(() => {
        this.redisSubscriber.subscribe('erp:system:events');
        this.redisSubscriber.on('message', (channel, message) => {
          if (channel === 'erp:system:events') {
            try {
              const event: SystemEvent = JSON.parse(message);
              this.subject$.next(event);
            } catch (e) {}
          }
        });
      })
      .catch(() => {});
  }

  onModuleDestroy() {
    this.redisPublisher?.disconnect();
    this.redisSubscriber?.disconnect();
  }

  emit(name: string, tenantId: string, payload: any) {
    if (!tenantId) {
      throw new BadRequestException(`EventBus cannot emit event "${name}" without a valid tenantId context.`);
    }

    const event: SystemEvent = {
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

  on(eventName?: string, tenantId?: string): Observable<SystemEvent> {
    return this.subject$.asObservable().pipe(
      filter((evt) => {
        const matchesEvent = !eventName || evt.name === eventName;
        const matchesTenant = !tenantId || evt.tenantId === tenantId;
        return matchesEvent && matchesTenant;
      }),
    );
  }

  ofType(eventName?: string): Observable<SystemEvent> {
    return this.on(eventName);
  }
}
