import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApprovableEntity } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('approvals')
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @Get('pending')
  getPending(@CurrentUser() user: AuthenticatedUser, @Query('role') role: string) {
    return this.approvalsService.getPendingForRole(user.tenantId, role);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body()
    body: {
      entityType: ApprovableEntity;
      entityId: string;
      approverRoleRequired: string;
      reason?: string;
    },
  ) {
    return this.approvalsService.createRequest({
      tenantId: user.tenantId,
      requestedById: user.userId,
      ...body,
    });
  }

  @Post(':id/decide')
  decide(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { decision: 'APPROVED' | 'REJECTED'; note?: string },
  ) {
    // roles come from the verified JWT only — never from the request body.
    return this.approvalsService.decide(id, user.tenantId, user.userId, user.roles, body.decision, body.note);
  }
}
