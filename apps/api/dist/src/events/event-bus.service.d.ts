import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface SystemEvent {
    name: string;
    tenantId: string;
    payload: any;
    timestamp: string;
}
export declare class EventBusService implements OnModuleInit, OnModuleDestroy {
    private subject$;
    private redisPublisher;
    private redisSubscriber;
    onModuleInit(): void;
    onModuleDestroy(): void;
    emit(name: string, tenantId: string, payload: any): void;
    on(eventName?: string, tenantId?: string): Observable<SystemEvent>;
    ofType(eventName?: string): Observable<SystemEvent>;
}
