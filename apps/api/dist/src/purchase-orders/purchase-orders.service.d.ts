import { PrismaService } from '../prisma/prisma.service';
export declare class PurchaseOrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        warehouseId: string | null;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        supplierId: string;
        createdById: string | null;
        orderedAt: Date | null;
        receivedAt: Date | null;
    }>;
    findOne(id: string): Promise<{
        lines: {
            productId: string;
            id: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            quantityOrdered: number;
            quantityReceived: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        warehouseId: string | null;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        supplierId: string;
        createdById: string | null;
        orderedAt: Date | null;
        receivedAt: Date | null;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        warehouseId: string | null;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        supplierId: string;
        createdById: string | null;
        orderedAt: Date | null;
        receivedAt: Date | null;
    }>;
    submit(id: string, tenantId: string): Promise<{
        lines: {
            productId: string;
            id: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            quantityOrdered: number;
            quantityReceived: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        warehouseId: string | null;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        supplierId: string;
        createdById: string | null;
        orderedAt: Date | null;
        receivedAt: Date | null;
    }>;
    receiveOrder(id: string, tenantId: string, dto: {
        lines: {
            purchaseOrderLineId: string;
            quantityReceived: number;
        }[];
    }): Promise<{
        lines: {
            productId: string;
            id: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            quantityOrdered: number;
            quantityReceived: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        warehouseId: string | null;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        supplierId: string;
        createdById: string | null;
        orderedAt: Date | null;
        receivedAt: Date | null;
    }>;
}
