export declare class CreatePOLineDto {
    productId: string;
    quantityOrdered: number;
    unitPrice: number;
}
export declare class CreatePODto {
    supplierId: string;
    lines: CreatePOLineDto[];
}
