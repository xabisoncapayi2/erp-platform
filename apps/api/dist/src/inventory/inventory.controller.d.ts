import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getInventory(): Promise<({
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
    getProductMovements(productId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        quantityChange: number;
        reason: import(".prisma/client").$Enums.MovementReason;
        referenceId: string | null;
        inventoryItemId: string;
    }[]>;
}
