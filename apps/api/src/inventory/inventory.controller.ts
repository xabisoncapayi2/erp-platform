import { Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory() {
    const tenantId = 'tenant-1';
    return this.inventoryService.getInventory(tenantId);
  }

  @Get('movements/:productId')
  async getProductMovements(@Param('productId') productId: string) {
    const tenantId = 'tenant-1';
    return this.inventoryService.getMovementsForProduct(productId, tenantId);
  }
}
