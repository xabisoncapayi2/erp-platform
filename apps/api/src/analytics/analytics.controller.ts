import { Controller, Get, Post, Body, Query, Param, Headers } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get("getDashboardMetrics")
  async getDashboardMetrics(@Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.getDashboardMetrics((tenantHeader || "default-tenant"));
  }

  @Get("getMonthlySales")
  async getMonthlySales(@Headers("x-tenant-id") tenantHeader?: string, @Query() year?: any, @Query() month?: any) {
    return this.service.getMonthlySales((tenantHeader || "default-tenant"), year, month);
  }

  @Get("getTopSellingProducts")
  async getTopSellingProducts(@Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.getTopSellingProducts((tenantHeader || "default-tenant"));
  }

  @Get("getInventoryValuationByWarehouse")
  async getInventoryValuationByWarehouse(@Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.getInventoryValuationByWarehouse((tenantHeader || "default-tenant"));
  }
}
