import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { SupplierInvoicesService, CreateSupplierInvoiceDto } from './supplier-invoices.service';

@Controller('supplier-invoices')
export class SupplierInvoicesController {
  constructor(private supplierInvoicesService: SupplierInvoicesService) {}

  @Post()
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: Omit<CreateSupplierInvoiceDto, 'dueDate'> & { dueDate: string },
  ) {
    return this.supplierInvoicesService.create(tenantId, {
      ...dto,
      dueDate: new Date(dto.dueDate),
    });
  }

  @Post(':id/approve')
  approve(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.supplierInvoicesService.approve(id, tenantId);
  }

  @Post(':id/reject')
  reject(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return this.supplierInvoicesService.reject(id, tenantId, body.reason);
  }
}
