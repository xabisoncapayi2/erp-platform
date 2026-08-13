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
        id: string;
        createdAt: Date;
        tenantId: string;
        warehouseId: string;
        status: import(".prisma/client").$Enums.SalesOrderStatus;
        fulfilledAt: Date | null;
        customerId: string;
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
