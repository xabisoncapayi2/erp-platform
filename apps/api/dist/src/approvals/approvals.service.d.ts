import { PrismaService } from '../prisma/prisma.service';
import { ApprovableEntity } from '@prisma/client';
export declare class ApprovalsService {
    private prisma;
    constructor(prisma: PrismaService);
    createRequest(params: {
        tenantId: string;
        entityType: ApprovableEntity;
        entityId: string;
        requestedById: string;
        approverRoleRequired: string;
        reason?: string;
    }): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApprovalStatus;
        reason: string | null;
        entityType: import(".prisma/client").$Enums.ApprovableEntity;
        entityId: string;
        requestedById: string;
        approverRoleRequired: string;
        decidedById: string | null;
        decidedAt: Date | null;
        decisionNote: string | null;
    }>;
    decide(requestId: string, tenantId: string, decidedById: string, approverRoles: string[], decision: 'APPROVED' | 'REJECTED', decisionNote?: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApprovalStatus;
        reason: string | null;
        entityType: import(".prisma/client").$Enums.ApprovableEntity;
        entityId: string;
        requestedById: string;
        approverRoleRequired: string;
        decidedById: string | null;
        decidedAt: Date | null;
        decisionNote: string | null;
    }>;
    getPendingForRole(tenantId: string, role: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApprovalStatus;
        reason: string | null;
        entityType: import(".prisma/client").$Enums.ApprovableEntity;
        entityId: string;
        requestedById: string;
        approverRoleRequired: string;
        decidedById: string | null;
        decidedAt: Date | null;
        decisionNote: string | null;
    }[]>;
}
