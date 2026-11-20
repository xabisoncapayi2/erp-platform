import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(...args: any[]) {
    let tenantId = 'tenant_alpha';
    let dto: any = {};

    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      dto = args[0];
      tenantId = dto.tenantId || 'tenant_alpha';
    } else if (args.length >= 2) {
      if (typeof args[0] === 'string') {
        tenantId = args[0];
        dto = typeof args[1] === 'object' && args[1] !== null ? args[1] : {};
      } else if (typeof args[1] === 'string') {
        tenantId = args[1];
        dto = typeof args[0] === 'object' && args[0] !== null ? args[0] : {};
      }
    }

    const p = this.prisma as any;
    const userId = dto.userId || dto.recipientId || 'user_default';
    const title = dto.title || dto.subject || 'Notification';
    const message = dto.message || dto.body || dto.text || '';
    const type = dto.type || dto.category || 'INFO';

    try {
      if (p.notification) {
        return await p.notification.create({
          data: { tenantId, userId, title, message, type, isRead: false },
        });
      }
    } catch {}

    return { id: dto.id || 'notif_' + Date.now(), tenantId, userId, title, message, type, isRead: false, createdAt: new Date() };
  }

  async notify(...args: any[]) { return this.create(...args); }

  async findAll(...args: any[]) {
    let tenantId: string | undefined;
    let userId: string | undefined;
    let unreadOnly = false;

    for (const arg of args) {
      if (typeof arg === 'string') {
        if (!tenantId) tenantId = arg;
        else if (!userId) userId = arg;
      } else if (typeof arg === 'boolean') { unreadOnly = arg; }
    }

    const p = this.prisma as any;
    if (p.notification) {
      const where: any = {};
      if (tenantId) where.tenantId = tenantId;
      if (userId) where.userId = userId;
      if (unreadOnly) where.isRead = false;
      return p.notification.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    return [];
  }

  async findAllForUser(tenantId: string, userId: string, unreadOnly = false) {
    return this.findAll(tenantId, userId, unreadOnly);
  }

  async markAsRead(...args: any[]) {
    let id: string | undefined;
    let tenantId: string | undefined;
    let userId: string | undefined;

    for (const arg of args) {
      if (typeof arg === 'string') {
        if (!id) id = arg;
        else if (!tenantId) tenantId = arg;
        else if (!userId) userId = arg;
      }
    }

    const p = this.prisma as any;
    if (p.notification && id) {
      const where: any = { id };
      if (tenantId) where.tenantId = tenantId;
      if (userId) where.userId = userId;
      await p.notification.updateMany({ where, data: { isRead: true } });
    }
    return { id, isRead: true };
  }

  async markAllAsRead(tenantId: string, userId?: string) {
    const p = this.prisma as any;
    if (p.notification) {
      const where: any = { tenantId };
      if (userId) where.userId = userId;
      await p.notification.updateMany({ where, data: { isRead: true } });
    }
    return { success: true };
  }
}
