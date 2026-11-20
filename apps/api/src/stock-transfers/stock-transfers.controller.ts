import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StockTransfersService } from './stock-transfers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';

@Controller('stock-transfers')
@UseGuards(JwtAuthGuard)
export class StockTransfersController {
  constructor(private readonly service: StockTransfersService) {}

  @Post('transfer')
  async transfer(
    @CurrentTenant() tenantId: string,
    @Body() dto: any,
  ) {
    return this.service.transfer(tenantId, dto);
  }
}
