import { PrismaService } from '../prisma/prisma.service';
import { GeneralLedgerService } from '../general-ledger/general-ledger.service';
export interface SalesOrderLineDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export interface CreateSalesOrderDto {
    customerId: string;
    warehouseId: string;
    lines: SalesOrderLineDto[];
}
export declare class SalesOrdersService {
    private prisma;
    private glService;
    constructor(prisma: PrismaService, glService: GeneralLedgerService);
    create(tenantId: string, dto: CreateSalesOrderDto): Promise<{
        lines: {
            productId: string;
            id: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            salesOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        warehouseId: string;
        status: import(".prisma/client").$Enums.SalesOrderStatus;
        fulfilledAt: Date | null;
        customerId: string;
    }>;
    fulfill(orderId: string, tenantId: string): Promise<{
        order: {
            lines: {
                productId: string;
                id: string;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                salesOrderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            tenantId: string;
            warehouseId: string;
            status: import(".prisma/client").$Enums.SalesOrderStatus;
            fulfilledAt: Date | null;
            customerId: string;
        };
        totalRevenue: number;
        totalCost: number;
    }>;
}
