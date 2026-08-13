import { Controller, Get, Post, Body, Query, UseGuards, Request } from "@nestjs/common";
import { AuditLogsService } from "./audit-logs.service";
import { CreateAuditLogDto } from "./create-audit-log.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("audit-logs")
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  async create(@Body() dto: CreateAuditLogDto, @Request() req: any) {
    const tenantId = req.user?.tenantId || dto.tenantId;
    return this.auditLogsService.log({
      ...dto,
      tenantId,
      userId: req.user?.id || dto.userId,
      userEmail: req.user?.email || dto.userEmail,
      ipAddress: req.ip || dto.ipAddress,
      userAgent: req.headers["user-agent"] || dto.userAgent,
    });
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query("entity") entity?: string,
    @Query("action") action?: string,
    @Query("limit") limit?: string,
  ) {
    const tenantId = req.user?.tenantId || "default-tenant";
    return this.auditLogsService.findAll(tenantId, {
      entity,
      action,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }
}
