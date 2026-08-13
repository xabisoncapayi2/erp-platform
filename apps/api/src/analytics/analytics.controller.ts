import { Controller, Get, Query, Headers } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get("getDashboardMetrics")
  async getDashboardMetrics(@Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.getDashboardMetrics(tenantHeader || "default-tenant");
  }

  @Get("getMonthlySales")
  async getMonthlySales(
    @Headers("x-tenant-id") tenantHeader?: string,
    @Query("year") year?: string,
    @Query("month") month?: string,
  ) {
    return this.service.getMonthlySales(tenantHeader || "default-tenant", year, month);
  }

  @Get("getTopSellingProducts")
  async getTopSellingProducts(
    @Headers("x-tenant-id") tenantHeader?: string,
    @Query("limit") limit?: string,
  ) {
    return this.service.getTopSellingProducts(tenantHeader || "default-tenant", limit ? Number(limit) : 5);
  }

  @Get("getInventoryValuationByWarehouse")
  async getInventoryValuationByWarehouse(@Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.getInventoryValuationByWarehouse(tenantHeader || "default-tenant");
  }
}
