import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./create-notification.dto";
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    notify(dto: CreateNotificationDto): Promise<{
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
    create(dto: CreateNotificationDto): Promise<{
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
    findAll(tenantId: string, userId: string, unreadOnly?: boolean): Promise<{
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
    markAsRead(id: string, tenantId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(tenantId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
