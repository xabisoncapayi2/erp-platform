import { Controller, Post, Get, Body, Headers, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import type { CreateSupplierDto } from './suppliers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.suppliersService.findAll(tenantId);
  }
}
