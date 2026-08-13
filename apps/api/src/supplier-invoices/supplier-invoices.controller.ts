import { Controller, Get, Post, Body, Query, Param, Headers } from "@nestjs/common";
import { SupplierInvoicesService } from "./supplier-invoices.service";

@Controller("supplier-invoices")
export class SupplierInvoicesController {
  constructor(private readonly service: SupplierInvoicesService) {}

  @Post("create")
  async create(@Headers("x-tenant-id") tenantHeader?: string, @Body() dto?: any) {
    return this.service.create((tenantHeader || "default-tenant"), dto);
  }

  @Get("approve")
  async approve(@Query("invoiceId") invoiceId?: string, @Headers("x-tenant-id") tenantHeader?: string) {
    return this.service.approve(invoiceId, (tenantHeader || "default-tenant"));
  }

  @Get("reject")
  async reject(@Query("invoiceId") invoiceId?: string, @Headers("x-tenant-id") tenantHeader?: string, @Query() reason?: any) {
    return this.service.reject(invoiceId, (tenantHeader || "default-tenant"), reason);
  }
}
