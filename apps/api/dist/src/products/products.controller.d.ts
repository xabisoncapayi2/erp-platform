import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: any): Promise<{
        id: string;
        name: string;
        tenantId: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        tenantId: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
