import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { SalesOrdersService, CreateSalesOrderDto } from './sales-orders.service';

@Controller('sales-orders')
export class SalesOrdersController {
  constructor(private salesOrdersService: SalesOrdersService) {}

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() body: CreateSalesOrderDto) {
    return this.salesOrdersService.create(tenantId, body);
  }

  @Post(':id/fulfill')
  fulfill(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.salesOrdersService.fulfill(id, tenantId);
  }
}
