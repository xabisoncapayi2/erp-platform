export declare class CreateNotificationDto {
    tenantId: string;
    userId?: string;
    title?: string;
    message: string;
    type?: string;
    metadata?: Record<string, any>;
}
