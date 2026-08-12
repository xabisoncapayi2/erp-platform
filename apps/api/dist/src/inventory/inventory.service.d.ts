import { PrismaService } from '../prisma/prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<({
        product: {
            tenantId: string;
            name: string;
            id: string;
            sku: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        tenantId: string;
        productId: string;
        id: string;
        warehouseId: string;
        quantityOnHand: number;
    })[]>;
    getInventory(tenantId: string): Promise<({
        product: {
            tenantId: string;
            name: string;
            id: string;
            sku: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        tenantId: string;
        productId: string;
        id: string;
        warehouseId: string;
        quantityOnHand: number;
    })[]>;
    getStockLevel(tenantId: string, productId: string): Promise<number>;
    getMovements(tenantId: string, productId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        quantityChange: number;
        reason: import(".prisma/client").$Enums.MovementReason;
        referenceId: string | null;
        inventoryItemId: string;
    }[]>;
    getMovementsForProduct(productId: string, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        quantityChange: number;
        reason: import(".prisma/client").$Enums.MovementReason;
        referenceId: string | null;
        inventoryItemId: string;
    }[]>;
}
