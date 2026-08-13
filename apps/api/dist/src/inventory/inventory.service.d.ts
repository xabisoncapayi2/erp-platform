import { PrismaService } from '../prisma/prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<({
        product: {
            id: string;
            name: string;
            tenantId: string;
            sku: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        productId: string;
        id: string;
        tenantId: string;
        warehouseId: string;
        reorderLevel: number;
        quantityOnHand: number;
    })[]>;
    getInventory(tenantId: string): Promise<({
        product: {
            id: string;
            name: string;
            tenantId: string;
            sku: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        productId: string;
        id: string;
        tenantId: string;
        warehouseId: string;
        reorderLevel: number;
        quantityOnHand: number;
    })[]>;
    getStockLevel(tenantId: string, productId: string): Promise<number>;
    getMovements(tenantId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        reason: import(".prisma/client").$Enums.MovementReason;
        inventoryItemId: string;
        quantityChange: number;
        referenceId: string | null;
    }[]>;
    getMovementsForProduct(productId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        reason: import(".prisma/client").$Enums.MovementReason;
        inventoryItemId: string;
        quantityChange: number;
        referenceId: string | null;
    }[]>;
}
