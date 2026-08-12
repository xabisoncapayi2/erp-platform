import { OnModuleInit } from '@nestjs/common';
export declare class NotificationPublisherService implements OnModuleInit {
    private client;
    onModuleInit(): void;
    emitStockAlert(tenantId: string, productId: string, currentStock: number): Promise<import("rxjs").Observable<any>>;
    emitPOApproved(tenantId: string, poId: string, totalAmount: number): Promise<import("rxjs").Observable<any>>;
}
