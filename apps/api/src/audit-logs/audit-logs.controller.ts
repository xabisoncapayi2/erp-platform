import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AuditLogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(
    @CurrentTenant() tenantId: string,
    @Request() req: any,
    @Body() dto: CreateAuditLogDto,
  ) {
    const p = this.prisma as any;
    if (p.auditLog) {
      return p.auditLog.create({
        data: {
          tenantId,
          userId: req.user.userId || req.user.sub || 'system',
          action: dto.action,
          entity: dto.entity,
          entityId: dto.entityId,
          details: dto.details ? JSON.stringify(dto.details) : null,
        },
      });
    }
    return { id: 'audit_' + Date.now(), tenantId, ...dto, createdAt: new Date() };
  }

  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('entity') entity?: string,
  ) {
    const p = this.prisma as any;
    if (p.auditLog) {
      const where: any = { tenantId };
      if (entity) where.entity = entity;
      return p.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    }
    return [];
  }
}
