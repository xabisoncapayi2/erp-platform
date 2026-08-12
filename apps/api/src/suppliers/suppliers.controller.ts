import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SuppliersService, CreateSupplierDto } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    const tenantId = 'tenant-1';
    return this.suppliersService.create(tenantId, createSupplierDto);
  }

  @Get()
  async findAll() {
    const tenantId = 'tenant-1';
    return this.suppliersService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tenantId = 'tenant-1';
    return this.suppliersService.findOne(id, tenantId);
  }
}
