import { PrismaService } from '../prisma/prisma.service';
export interface CreateSupplierInvoiceLineDto {
    purchaseOrderLineId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
export interface CreateSupplierInvoiceDto {
    supplierId: string;
    purchaseOrderId: string;
    invoiceNumber: string;
    subTotal: number;
    taxTotal: number;
    grandTotal: number;
    dueDate: Date;
    lines: CreateSupplierInvoiceLineDto[];
}
export declare class SupplierInvoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateSupplierInvoiceDto): Promise<{
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
    approve(invoiceId: string, tenantId: string): Promise<{
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
    reject(invoiceId: string, tenantId: string, reason: string): Promise<{
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
