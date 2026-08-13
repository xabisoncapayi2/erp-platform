import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./create-notification.dto";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(dto: CreateNotificationDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        message: string;
        type: string | null;
        title: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        read: boolean;
    }>;
    findAll(req: any, unreadOnly?: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        message: string;
        type: string | null;
        title: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        read: boolean;
    }[]>;
    markAsRead(id: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
