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
        tenantId: string;
        productId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.StockTransferStatus;
        sourceWarehouseId: string;
        destWarehouseId: string;
        quantity: number;
        completedAt: Date | null;
    }>;
}
