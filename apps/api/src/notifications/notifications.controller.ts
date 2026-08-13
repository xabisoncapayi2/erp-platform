import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./create-notification.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto, @Request() req: any) {
    const tenantId = req.user?.tenantId || dto.tenantId;
    const userId = req.user?.id || dto.userId;
    return this.notificationsService.create({ ...dto, tenantId, userId });
  }

  @Get()
  async findAll(@Request() req: any, @Query("unreadOnly") unreadOnly?: string) {
    const tenantId = req.user?.tenantId || "default-tenant";
    const userId = req.user?.id || "system";
    return this.notificationsService.findAll(tenantId, userId, unreadOnly === "true");
  }

  @Patch(":id/read")
  async markAsRead(@Param("id") id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || "default-tenant";
    const userId = req.user?.id || "system";
    return this.notificationsService.markAsRead(id, tenantId, userId);
  }

  @Patch("read-all")
  async markAllAsRead(@Request() req: any) {
    const tenantId = req.user?.tenantId || "default-tenant";
    const userId = req.user?.id || "system";
    return this.notificationsService.markAllAsRead(tenantId, userId);
  }
}
