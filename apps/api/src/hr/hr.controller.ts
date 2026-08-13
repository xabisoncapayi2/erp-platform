import { Controller, Get, Post, Body, Query, Param, Headers } from "@nestjs/common";
import { HrService } from "./hr.service";

@Controller("hr")
export class HrController {
  constructor(private readonly service: HrService) {}

  @Post("employees")
  async createEmployee(
    @Headers("x-tenant-id") tenantHeader?: string,
    @Body() dto?: any,
  ) {
    return this.service.createEmployee(tenantHeader || "default-tenant", dto || {});
  }

  @Get("employees")
  async getEmployees(@Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.getEmployees(tenantHeader || "default-tenant");
  }

  @Get("employees/:id")
  async getEmployeeById(
    @Headers("x-tenant-id") tenantHeader?: string,
    @Param("id") id?: string,
  ) {
    return this.service.getEmployeeById(tenantHeader || "default-tenant", id || "");
  }

  @Post("payroll")
  async processPayroll(
    @Headers("x-tenant-id") tenantHeader?: string,
    @Body() dto?: any,
  ) {
    return this.service.processPayroll(tenantHeader || "default-tenant", dto || {});
  }

  @Get("payroll")
  async getPayrollRecords(@Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.getPayrollRecords(tenantHeader || "default-tenant");
  }
}
