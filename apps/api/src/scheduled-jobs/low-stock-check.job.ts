import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class LowStockCheckJob {
  private readonly logger = new Logger(LowStockCheckJob.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async checkLowStock() {
    this.logger.log('Running nightly low-stock check...');

    const items = await this.prisma.inventoryItem.findMany({
      include: { product: true, warehouse: true },
    });

    const lowStockItems = items.filter((item) => item.quantityOnHand < item.reorderLevel);

    for (const item of lowStockItems) {
      await this.notificationsService.notify({
        tenantId: item.tenantId,
        type: NotificationType.LOW_STOCK,
        message:
          `${item.product.name} is low in ${item.warehouse.name}: ` +
          `${item.quantityOnHand} on hand, reorder level is ${item.reorderLevel}.`,
      });
    }

    this.logger.log(`Low-stock check complete: ${lowStockItems.length} alert(s) sent.`);
  }
}
