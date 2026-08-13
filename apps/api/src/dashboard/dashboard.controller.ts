import { Controller, Get, Headers, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(
    @Headers('x-tenant-id') tenantId: string,
    @Query('role') role: string = 'MANAGER',
  ) {
    return this.dashboardService.getSummary(tenantId, role);
  }
}
