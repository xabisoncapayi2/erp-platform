import { SuppliersService, CreateSupplierDto } from './suppliers.service';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto): Promise<{
        tenantId: string;
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        address: string | null;
    }>;
    findAll(): Promise<{
        tenantId: string;
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        address: string | null;
    }[]>;
    findOne(id: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        address: string | null;
    }>;
}
