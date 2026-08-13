import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditLogDto } from "./create-audit-log.dto";
export declare class AuditLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(dto: CreateAuditLogDto): Promise<{
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
    findAll(tenantId: string, options?: {
        entity?: string;
        action?: string;
        limit?: number;
    }): Promise<{
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
