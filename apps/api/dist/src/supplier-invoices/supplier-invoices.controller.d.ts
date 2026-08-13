import { SupplierInvoicesService } from "./supplier-invoices.service";
export declare class SupplierInvoicesController {
    private readonly service;
    constructor(service: SupplierInvoicesService);
    create(tenantHeader?: string, dto?: any): Promise<{
        lines: {
            productId: string;
            id: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            purchaseOrderLineId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            supplierInvoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.SupplierInvoiceStatus;
        supplierId: string;
        purchaseOrderId: string;
        invoiceNumber: string;
        subTotal: import("@prisma/client-runtime-utils").Decimal;
        taxTotal: import("@prisma/client-runtime-utils").Decimal;
        grandTotal: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
    }>;
    approve(invoiceId?: string, tenantHeader?: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.SupplierInvoiceStatus;
        supplierId: string;
        purchaseOrderId: string;
        invoiceNumber: string;
        subTotal: import("@prisma/client-runtime-utils").Decimal;
        taxTotal: import("@prisma/client-runtime-utils").Decimal;
        grandTotal: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
    }>;
    reject(invoiceId?: string, tenantHeader?: string, reason?: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.SupplierInvoiceStatus;
        supplierId: string;
        purchaseOrderId: string;
        invoiceNumber: string;
        subTotal: import("@prisma/client-runtime-utils").Decimal;
        taxTotal: import("@prisma/client-runtime-utils").Decimal;
        grandTotal: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
    }>;
}
