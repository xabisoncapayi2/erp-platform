import { PrismaService } from '../prisma/prisma.service';
export interface CreateCustomerDto {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateCustomerDto): Promise<{
        tenantId: string;
        name: string;
        id: string;
        email: string;
    }>;
    findAll(tenantId: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        email: string;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        email: string;
    }>;
}
