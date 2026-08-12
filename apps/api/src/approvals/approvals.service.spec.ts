import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovableEntity, ApprovalStatus } from '@prisma/client';

const mockPrisma = {
  approvalRequest: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ApprovalsService', () => {
  let service: ApprovalsService;

  const TENANT_ID = 'tenant-1';
  const REQUEST_ID = 'req-1';
  const REQUESTER_ID = 'user-requester';
  const APPROVER_ID = 'user-approver';
  const REQUIRED_ROLE = 'procurement:approve';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApprovalsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<ApprovalsService>(ApprovalsService);
  });

  describe('createRequest', () => {
    it('creates a request when no pending one exists for the entity', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue(null);
      mockPrisma.approvalRequest.create.mockResolvedValue({ id: REQUEST_ID });

      const result = await service.createRequest({
        tenantId: TENANT_ID,
        entityType: ApprovableEntity.PURCHASE_ORDER,
        entityId: 'po-1',
        requestedById: REQUESTER_ID,
        approverRoleRequired: REQUIRED_ROLE,
        reason: 'exceeds threshold',
      });

      expect(result.id).toBe(REQUEST_ID);
      expect(mockPrisma.approvalRequest.create).toHaveBeenCalled();
    });

    it('blocks creating a second pending request for the same entity', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue({ id: 'existing-req', status: ApprovalStatus.PENDING });

      await expect(
        service.createRequest({
          tenantId: TENANT_ID,
          entityType: ApprovableEntity.PURCHASE_ORDER,
          entityId: 'po-1',
          requestedById: REQUESTER_ID,
          approverRoleRequired: REQUIRED_ROLE,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrisma.approvalRequest.create).not.toHaveBeenCalled();
    });
  });

  describe('decide', () => {
    const pendingRequest = {
      id: REQUEST_ID,
      tenantId: TENANT_ID,
      status: ApprovalStatus.PENDING,
      requestedById: REQUESTER_ID,
      approverRoleRequired: REQUIRED_ROLE,
    };

    it('throws NotFoundException if the request does not exist for this tenant', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue(null);
      await expect(
        service.decide(REQUEST_ID, TENANT_ID, APPROVER_ID, [REQUIRED_ROLE], 'APPROVED'),
      ).rejects.toThrow(NotFoundException);
    });

    it('approves when the decider holds the required role and is not the requester', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue(pendingRequest);
      mockPrisma.approvalRequest.update.mockResolvedValue({ ...pendingRequest, status: ApprovalStatus.APPROVED });

      const result = await service.decide(REQUEST_ID, TENANT_ID, APPROVER_ID, [REQUIRED_ROLE], 'APPROVED');
      expect(result.status).toBe(ApprovalStatus.APPROVED);
    });

    it('rejects when decision is REJECTED and persists the decision note', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue(pendingRequest);
      mockPrisma.approvalRequest.update.mockResolvedValue({
        ...pendingRequest,
        status: ApprovalStatus.REJECTED,
        decisionNote: 'Budget not available this quarter',
      });

      const result = await service.decide(
        REQUEST_ID, TENANT_ID, APPROVER_ID, [REQUIRED_ROLE], 'REJECTED', 'Budget not available this quarter',
      );
      expect(result.status).toBe(ApprovalStatus.REJECTED);
    });

    it('blocks self-approval even if the requester holds the required role', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue(pendingRequest);
      await expect(
        service.decide(REQUEST_ID, TENANT_ID, REQUESTER_ID, [REQUIRED_ROLE], 'APPROVED'),
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrisma.approvalRequest.update).not.toHaveBeenCalled();
    });

    it('blocks a decider who does not hold the required role', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue(pendingRequest);
      await expect(
        service.decide(REQUEST_ID, TENANT_ID, APPROVER_ID, ['some:other:role'], 'APPROVED'),
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrisma.approvalRequest.update).not.toHaveBeenCalled();
    });

    it('blocks deciding a request that has already been decided', async () => {
      mockPrisma.approvalRequest.findFirst.mockResolvedValue({ ...pendingRequest, status: ApprovalStatus.APPROVED });
      await expect(
        service.decide(REQUEST_ID, TENANT_ID, APPROVER_ID, [REQUIRED_ROLE], 'REJECTED'),
      ).rejects.toThrow(BadRequestException);
      expect(mockPrisma.approvalRequest.update).not.toHaveBeenCalled();
    });
  });

  describe('getPendingForRole', () => {
    it('returns only pending requests matching the given role, oldest first', async () => {
      mockPrisma.approvalRequest.findMany.mockResolvedValue([
        { id: 'req-a', createdAt: new Date('2026-01-01') },
        { id: 'req-b', createdAt: new Date('2026-01-02') },
      ]);
      const result = await service.getPendingForRole(TENANT_ID, REQUIRED_ROLE);
      expect(result).toHaveLength(2);
    });
  });
});
