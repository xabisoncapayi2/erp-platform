import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
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

    this.redisPublisher.connect().catch(() => {
      // Fallback to in-memory if Redis container is offline
    });

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
    const event: SystemEvent = {
      name,
      tenantId,
      payload,
      timestamp: new Date().toISOString(),
    };

    // 1. Emit locally via RxJS
    this.subject$.next(event);

    // 2. Publish globally via Redis Pub/Sub
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
