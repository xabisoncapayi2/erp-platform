import { StockTransfersService } from "./stock-transfers.service";
export declare class StockTransfersController {
    private readonly service;
    constructor(service: StockTransfersService);
    transfer(tenantHeader?: string, dto?: any): Promise<{
        productId: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.StockTransferStatus;
        quantity: number;
        sourceWarehouseId: string;
        destWarehouseId: string;
        completedAt: Date | null;
    }>;
}
