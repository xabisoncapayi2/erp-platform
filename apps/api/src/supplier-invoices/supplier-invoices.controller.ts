import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SupplierInvoicesService } from './supplier-invoices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';

@Controller('supplier-invoices')
@UseGuards(JwtAuthGuard)
export class SupplierInvoicesController {
  constructor(private readonly service: SupplierInvoicesService) {}

  @Post('create')
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: any,
  ) {
    return this.service.create(tenantId, dto);
  }

  @Get('approve')
  async approve(
    @CurrentTenant() tenantId: string,
    @Query('invoiceId') invoiceId: string,
  ) {
    return this.service.approve(invoiceId, tenantId);
  }

  @Get('reject')
  async reject(
    @CurrentTenant() tenantId: string,
    @Query('invoiceId') invoiceId: string,
    @Query('reason') reason?: string,
  ) {
    return this.service.reject(invoiceId, tenantId, reason);
  }
}
