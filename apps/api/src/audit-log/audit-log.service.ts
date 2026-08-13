import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, Prisma } from '@prisma/client';

type PrismaClientOrTx = PrismaService | Prisma.TransactionClient;

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async record(
    params: {
      tenantId: string;
      entityType: string;
      entityId: string;
      action: AuditAction;
      actorId: string;
      beforeData?: unknown;
      afterData?: unknown;
    },
    tx?: PrismaClientOrTx,
  ) {
    const db = tx ?? this.prisma;
    return db.auditLog.create({
      data: {
        tenantId: params.tenantId,
        entity: params.entityType,
        action: params.action,
        actorId: params.actorId,
        beforeData: params.beforeData as Prisma.InputJsonValue,
        afterData: params.afterData as Prisma.InputJsonValue,
      },
    });
  }

  async getHistoryFor(tenantId: string, entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { tenantId, entity: entityType },
      orderBy: { createdAt: 'desc' },
    });
  }
}
