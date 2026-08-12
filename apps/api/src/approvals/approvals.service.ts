import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovableEntity, ApprovalStatus } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(params: {
    tenantId: string;
    entityType: ApprovableEntity;
    entityId: string;
    requestedById: string;
    approverRoleRequired: string;
    reason?: string;
  }) {
    const existing = await this.prisma.approvalRequest.findFirst({
      where: {
        tenantId: params.tenantId,
        entityType: params.entityType,
        entityId: params.entityId,
        status: ApprovalStatus.PENDING,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `An approval request is already pending for this ${params.entityType}.`,
      );
    }

    return this.prisma.approvalRequest.create({ data: params });
  }

  async decide(
    requestId: string,
    tenantId: string,
    decidedById: string,
    approverRoles: string[],
    decision: 'APPROVED' | 'REJECTED',
    decisionNote?: string,
  ) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id: requestId, tenantId },
    });

    if (!request) {
      throw new NotFoundException(`Approval request ${requestId} not found.`);
    }

    if (request.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException(
        `Approval request is already ${request.status}, cannot decide again.`,
      );
    }

    if (!approverRoles.includes(request.approverRoleRequired)) {
      throw new ForbiddenException(
        `You do not hold the required role (${request.approverRoleRequired}) to decide this request.`,
      );
    }

    if (request.requestedById === decidedById) {
      throw new ForbiddenException('You cannot approve your own request.');
    }

    return this.prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: decision,
        decidedById,
        decidedAt: new Date(),
        decisionNote,
      },
    });
  }

  async getPendingForRole(tenantId: string, role: string) {
    return this.prisma.approvalRequest.findMany({
      where: { tenantId, status: ApprovalStatus.PENDING, approverRoleRequired: role },
      orderBy: { createdAt: 'asc' },
    });
  }
}
