import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditLogDto } from "./create-audit-log.dto";

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async log(dto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        tenantId: dto.tenantId,
        userId: dto.userId,
        userEmail: dto.userEmail,
        action: dto.action,
        entity: dto.entity,
        entityId: dto.entityId,
        details: dto.details ?? {},
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });
  }

  async findAll(tenantId: string, options?: { entity?: string; action?: string; limit?: number }) {
    const where: any = { tenantId };
    if (options?.entity) where.entity = options.entity;
    if (options?.action) where.action = options.action;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit || 100,
    });
  }
}
