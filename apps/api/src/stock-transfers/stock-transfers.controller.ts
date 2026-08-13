import { Controller, Get, Post, Body, Query, Param, Headers } from "@nestjs/common";
import { StockTransfersService } from "./stock-transfers.service";

@Controller("stock-transfers")
export class StockTransfersController {
  constructor(private readonly service: StockTransfersService) {}

  @Post("transfer")
  async transfer(@Headers("x-tenant-id") tenantHeader?: string, @Body() dto?: any) {
    return this.service.transfer((tenantHeader || "default-tenant"), dto);
  }
}
