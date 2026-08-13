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
        id: string;
        createdAt: Date;
        tenantId: string;
        entityType: import(".prisma/client").$Enums.ApprovableEntity;
        entityId: string;
        status: import(".prisma/client").$Enums.ApprovalStatus;
        reason: string | null;
        requestedById: string;
        approverRoleRequired: string;
        decidedById: string | null;
        decidedAt: Date | null;
        decisionNote: string | null;
    }>;
    decide(requestId: string, tenantId: string, decidedById: string, approverRoles: string[], decision: 'APPROVED' | 'REJECTED', decisionNote?: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        entityType: import(".prisma/client").$Enums.ApprovableEntity;
        entityId: string;
        status: import(".prisma/client").$Enums.ApprovalStatus;
        reason: string | null;
        requestedById: string;
        approverRoleRequired: string;
        decidedById: string | null;
        decidedAt: Date | null;
        decisionNote: string | null;
    }>;
    getPendingForRole(tenantId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        entityType: import(".prisma/client").$Enums.ApprovableEntity;
        entityId: string;
        status: import(".prisma/client").$Enums.ApprovalStatus;
        reason: string | null;
        requestedById: string;
        approverRoleRequired: string;
        decidedById: string | null;
        decidedAt: Date | null;
        decisionNote: string | null;
    }[]>;
}
