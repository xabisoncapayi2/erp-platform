export declare class CreatePOLineDto {
    productId: string;
    quantityOrdered: number;
    unitPrice: number;
}
export declare class CreatePurchaseOrderDto {
    poNumber: string;
    tenantId: string;
    supplierId: string;
    lines: CreatePOLineDto[];
}
