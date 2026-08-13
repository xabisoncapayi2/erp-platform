import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, Prisma } from '@prisma/client';
type PrismaClientOrTx = PrismaService | Prisma.TransactionClient;
export declare class AuditLogService {
    private prisma;
    constructor(prisma: PrismaService);
    record(params: {
        tenantId: string;
        entityType: string;
        entityId: string;
        action: AuditAction;
        actorId: string;
        beforeData?: unknown;
        afterData?: unknown;
    }, tx?: PrismaClientOrTx): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        entityId: string | null;
        userAgent: string | null;
        ipAddress: string | null;
        details: Prisma.JsonValue | null;
        afterData: Prisma.JsonValue | null;
        beforeData: Prisma.JsonValue | null;
        actorId: string | null;
        userEmail: string | null;
        userId: string | null;
        action: string;
        entity: string;
        payload: Prisma.JsonValue | null;
    }>;
    getHistoryFor(tenantId: string, entityType: string, entityId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        entityId: string | null;
        userAgent: string | null;
        ipAddress: string | null;
        details: Prisma.JsonValue | null;
        afterData: Prisma.JsonValue | null;
        beforeData: Prisma.JsonValue | null;
        actorId: string | null;
        userEmail: string | null;
        userId: string | null;
        action: string;
        entity: string;
        payload: Prisma.JsonValue | null;
    }[]>;
}
export {};
