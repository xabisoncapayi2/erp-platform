import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: any): Promise<{
        tenantId: string;
        name: string;
        id: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findAll(): Promise<{
        tenantId: string;
        name: string;
        id: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    findOne(id: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
