export declare class CreateSupplierInvoiceLineDto {
    productId: string;
    purchaseOrderLineId?: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
export declare class CreateSupplierInvoiceDto {
    supplierId: string;
    purchaseOrderId?: string;
    invoiceNumber: string;
    subTotal: number;
    taxTotal: number;
    grandTotal: number;
    dueDate: string;
    lines: CreateSupplierInvoiceLineDto[];
}
