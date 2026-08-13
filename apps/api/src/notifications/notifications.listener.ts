import { Injectable, OnModuleInit } from "@nestjs/common";
import { EventBusService } from "../events/event-bus.service";
import { NotificationsService } from "./notifications.service";

@Injectable()
export class NotificationsListener implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBusService,
    private readonly notificationsService: NotificationsService,
  ) {}

  onModuleInit() {
    this.eventBus.on("order.created").subscribe(async (evt) => {
      await this.notificationsService.create({
        tenantId: evt.tenantId,
        userId: evt.payload.userId || "admin",
        title: "New Sales Order",
        message: `Order #${evt.payload.orderId || evt.payload.id || "N/A"} was created.`,
        type: "INFO",
        metadata: evt.payload,
      });
    });

    this.eventBus.on("stock.low").subscribe(async (evt) => {
      await this.notificationsService.create({
        tenantId: evt.tenantId,
        userId: evt.payload.userId || "inventory-manager",
        title: "Low Stock Alert",
        message: `Item ${evt.payload.sku} is below threshold (${evt.payload.currentQuantity} remaining).`,
        type: "WARNING",
        metadata: evt.payload,
      });
    });

    this.eventBus.on("approval.requested").subscribe(async (evt) => {
      await this.notificationsService.create({
        tenantId: evt.tenantId,
        userId: evt.payload.approverId || "approver",
        title: "Approval Required",
        message: `Approval requested for ${evt.payload.entity} #${evt.payload.entityId}.`,
        type: "WARNING",
        metadata: evt.payload,
      });
    });
  }
}
