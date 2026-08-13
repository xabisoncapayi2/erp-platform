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
        id: string;
        name: string;
        email: string;
        tenantId: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        email: string;
        tenantId: string;
    }[]>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        name: string;
        email: string;
        tenantId: string;
    }>;
}
