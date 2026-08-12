import { PrismaService } from '../prisma/prisma.service';
import { Supplier } from '@prisma/client';
export declare class CreateSupplierDto {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: CreateSupplierDto): Promise<Supplier>;
    findAll(tenantId: string): Promise<Supplier[]>;
    findOne(tenantId: string, id: string): Promise<Supplier | null>;
}
