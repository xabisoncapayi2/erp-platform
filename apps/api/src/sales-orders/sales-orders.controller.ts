import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { SalesOrdersService } from './sales-orders.service';
import type { CreateSalesOrderDto } from './sales-orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales-orders')
@UseGuards(JwtAuthGuard)
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() body: CreateSalesOrderDto) {
    return this.salesOrdersService.create(tenantId, body);
  }
}
