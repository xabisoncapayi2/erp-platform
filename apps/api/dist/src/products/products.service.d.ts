import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: any, tenantId?: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findAll(tenantId?: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    findOne(id: string, tenantId?: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        sku: string;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
