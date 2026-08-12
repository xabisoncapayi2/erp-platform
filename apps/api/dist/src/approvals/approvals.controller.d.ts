import { ApprovalsService } from './approvals.service';
import { ApprovableEntity } from '@prisma/client';
import { AuthenticatedUser } from '../auth/current-user.decorator';
export declare class ApprovalsController {
    private approvalsService;
    constructor(approvalsService: ApprovalsService);
    getPending(user: AuthenticatedUser, role: string): Promise<{
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
    create(user: AuthenticatedUser, body: {
        entityType: ApprovableEntity;
        entityId: string;
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
    decide(user: AuthenticatedUser, id: string, body: {
        decision: 'APPROVED' | 'REJECTED';
        note?: string;
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
}
