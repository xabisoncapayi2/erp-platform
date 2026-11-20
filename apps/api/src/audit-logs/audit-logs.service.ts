import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    return (this.prisma as any).auditLog.create({
      data: {
        tenantId: dto.tenantId,
        userId: dto.userId,
        userEmail: dto.userEmail,
        action: dto.action,
        entity: dto.entity,
        entityId: dto.entityId,
        details: dto.details,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });
  }

  async log(dto: any) {
    return this.create(dto);
  }

  async findAll(tenantId: string) {
    return (this.prisma as any).auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
