export declare class CreateAuditLogDto {
    tenantId: string;
    userId?: string;
    userEmail?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
