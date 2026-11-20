import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HrService, CreateEmployeeDto } from './hr.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('hr')
@UseGuards(JwtAuthGuard, TenantGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Post('employees')
  async createEmployee(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.hrService.createEmployee(tenantId, dto);
  }

  @Get('employees')
  async getEmployees(@CurrentTenant() tenantId: string) {
    return this.hrService.getEmployees(tenantId);
  }

  @Get('employees/:id')
  async getEmployeeById(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.hrService.getEmployeeById(tenantId, id);
  }

  @Post('payroll/process')
  async processPayroll(
    @CurrentTenant() tenantId: string,
    @Body() dto: { employeeId: string; period: string },
  ) {
    return this.hrService.processPayroll(tenantId, dto);
  }

  @Get('payroll')
  async getPayrollRecords(@CurrentTenant() tenantId: string) {
    return this.hrService.getPayrollRecords(tenantId);
  }
}
