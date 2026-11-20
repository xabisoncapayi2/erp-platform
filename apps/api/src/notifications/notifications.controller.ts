import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, TenantGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(tenantId, dto);
  }

  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Request() req: any,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.findAll(tenantId, req.user.userId || req.user.sub, unreadOnly === 'true');
  }

  @Patch(':id/read')
  async markAsRead(
    @CurrentTenant() tenantId: string,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(id, tenantId, req.user.userId || req.user.sub);
  }

  @Patch('read-all')
  async markAllAsRead(
    @CurrentTenant() tenantId: string,
    @Request() req: any,
  ) {
    return this.notificationsService.markAllAsRead(tenantId, req.user.userId || req.user.sub);
  }
}
