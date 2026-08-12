import { PurchaseOrdersService } from './purchase-orders.service';
export declare class PurchaseOrdersController {
    private readonly purchaseOrdersService;
    constructor(purchaseOrdersService: PurchaseOrdersService);
    create(body: {
        tenantId: string;
        supplierId: string;
        warehouseId: string;
        lines: Array<{
            productId: string;
            quantity: number;
            unitPrice: number;
        }>;
    }): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        warehouseId: string | null;
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
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        warehouseId: string | null;
        supplierId: string;
        createdById: string | null;
        orderedAt: Date | null;
        receivedAt: Date | null;
    }>;
    updateStatus(id: string, body: {
        status: 'APPROVED' | 'REJECTED' | 'FULFILLED';
    }): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseOrderStatus;
        warehouseId: string | null;
        supplierId: string;
        createdById: string | null;
        orderedAt: Date | null;
        receivedAt: Date | null;
    }>;
}
