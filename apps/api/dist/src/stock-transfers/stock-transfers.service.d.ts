import { PrismaService } from '../prisma/prisma.service';
export interface CreateTransferDto {
    productId: string;
    sourceWarehouseId: string;
    destWarehouseId: string;
    quantity: number;
}
export declare class StockTransfersService {
    private prisma;
    constructor(prisma: PrismaService);
    transfer(tenantId: string, dto: CreateTransferDto): Promise<{
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
