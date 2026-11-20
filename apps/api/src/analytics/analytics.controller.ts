import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('getDashboardMetrics')
  async getDashboardMetrics(@CurrentTenant() tenantId: string) {
    return this.service.getDashboardMetrics(tenantId);
  }

  @Get('getMonthlySales')
  async getMonthlySales(
    @CurrentTenant() tenantId: string,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.service.getMonthlySales(tenantId, year, month);
  }

  @Get('getTopSellingProducts')
  async getTopSellingProducts(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getTopSellingProducts(tenantId, limit ? Number(limit) : 5);
  }

  @Get('getInventoryValuationByWarehouse')
  async getInventoryValuationByWarehouse(@CurrentTenant() tenantId: string) {
    return this.service.getInventoryValuationByWarehouse(tenantId);
  }
}
