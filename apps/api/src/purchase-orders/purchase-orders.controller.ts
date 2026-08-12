import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  async create(
    @Body()
    body: {
      tenantId: string;
      supplierId: string;
      warehouseId: string;
      lines: Array<{ productId: string; quantity: number; unitPrice: number }>;
    },
  ) {
    return this.purchaseOrdersService.create(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'FULFILLED' },
  ) {
    return this.purchaseOrdersService.updateStatus(id, body.status as any);
  }
}
