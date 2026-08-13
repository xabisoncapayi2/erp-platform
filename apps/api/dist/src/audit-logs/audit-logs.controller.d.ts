import { AuditLogsService } from "./audit-logs.service";
import { CreateAuditLogDto } from "./create-audit-log.dto";
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    create(dto: CreateAuditLogDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        entityId: string | null;
        userAgent: string | null;
        ipAddress: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        afterData: import("@prisma/client/runtime/client").JsonValue | null;
        beforeData: import("@prisma/client/runtime/client").JsonValue | null;
        actorId: string | null;
        userEmail: string | null;
        userId: string | null;
        action: string;
        entity: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findAll(req: any, entity?: string, action?: string, limit?: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        entityId: string | null;
        userAgent: string | null;
        ipAddress: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        afterData: import("@prisma/client/runtime/client").JsonValue | null;
        beforeData: import("@prisma/client/runtime/client").JsonValue | null;
        actorId: string | null;
        userEmail: string | null;
        userId: string | null;
        action: string;
        entity: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
