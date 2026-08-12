import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { CreateGlEntryDto } from './dto/create-gl-entry.dto';

@Controller('general-ledger')
export class GeneralLedgerController {
  constructor(private readonly glService: GeneralLedgerService) {}

  @Post('entries')
  @HttpCode(HttpStatus.CREATED)
  async createEntry(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateGlEntryDto,
  ) {
    return this.glService.createEntry(tenantId, dto);
  }

  @Get('trial-balance')
  async getTrialBalance(@Headers('x-tenant-id') tenantId: string) {
    return this.glService.getTrialBalance(tenantId);
  }
}
