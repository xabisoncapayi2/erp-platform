import { SupplierInvoicesService, CreateSupplierInvoiceDto } from './supplier-invoices.service';
export declare class SupplierInvoicesController {
    private supplierInvoicesService;
    constructor(supplierInvoicesService: SupplierInvoicesService);
    create(tenantId: string, dto: Omit<CreateSupplierInvoiceDto, 'dueDate'> & {
        dueDate: string;
    }): Promise<{
        lines: {
            productId: string;
            id: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            total: import("@prisma/client-runtime-utils").Decimal;
            purchaseOrderLineId: string;
            supplierInvoiceId: string;
        }[];
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SupplierInvoiceStatus;
        supplierId: string;
        purchaseOrderId: string;
        invoiceNumber: string;
        subTotal: import("@prisma/client-runtime-utils").Decimal;
        taxTotal: import("@prisma/client-runtime-utils").Decimal;
        grandTotal: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
    }>;
    approve(tenantId: string, id: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SupplierInvoiceStatus;
        supplierId: string;
        purchaseOrderId: string;
        invoiceNumber: string;
        subTotal: import("@prisma/client-runtime-utils").Decimal;
        taxTotal: import("@prisma/client-runtime-utils").Decimal;
        grandTotal: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
    }>;
    reject(tenantId: string, id: string, body: {
        reason: string;
    }): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
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
