import { SalesOrdersService, CreateSalesOrderDto } from './sales-orders.service';
export declare class SalesOrdersController {
    private salesOrdersService;
    constructor(salesOrdersService: SalesOrdersService);
    create(tenantId: string, body: CreateSalesOrderDto): Promise<{
        lines: {
            productId: string;
            id: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            salesOrderId: string;
        }[];
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SalesOrderStatus;
        customerId: string;
        warehouseId: string;
        fulfilledAt: Date | null;
    }>;
    fulfill(tenantId: string, id: string): Promise<{
        order: {
            lines: {
                productId: string;
                id: string;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                salesOrderId: string;
            }[];
        } & {
            tenantId: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.SalesOrderStatus;
            customerId: string;
            warehouseId: string;
            fulfilledAt: Date | null;
        };
        totalRevenue: number;
        totalCost: number;
    }>;
}
