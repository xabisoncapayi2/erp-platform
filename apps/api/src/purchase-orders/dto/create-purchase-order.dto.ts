export class CreatePOLineDto {
  productId: string;
  quantityOrdered: number;
  unitPrice: number;
}

export class CreatePurchaseOrderDto {
  poNumber: string;
  tenantId: string;
  supplierId: string;
  lines: CreatePOLineDto[];
}
