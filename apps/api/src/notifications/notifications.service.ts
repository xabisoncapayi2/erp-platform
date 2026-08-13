import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./create-notification.dto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

    async notify(dto: CreateNotificationDto) {
    return this.create(dto);
  }

async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        tenantId: dto.tenantId,
        userId: dto.userId ?? "system",
        title: dto.title ?? (dto.type || "System Alert"),
        message: dto.message,
        type: dto.type ?? "INFO",
        metadata: dto.metadata ?? {},
      },
    });
  }

  async findAll(tenantId: string, userId: string, unreadOnly?: boolean) {
    const where: any = { tenantId, userId };
    if (unreadOnly) where.read = false;

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async markAsRead(id: string, tenantId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, tenantId, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(tenantId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { tenantId, userId, read: false },
      data: { read: true },
    });
  }
}
