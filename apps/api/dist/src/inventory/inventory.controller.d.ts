import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getInventory(): Promise<({
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
    getProductMovements(productId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        reason: import(".prisma/client").$Enums.MovementReason;
        inventoryItemId: string;
        quantityChange: number;
        referenceId: string | null;
    }[]>;
}
