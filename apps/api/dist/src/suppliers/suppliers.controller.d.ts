import { SuppliersService, CreateSupplierDto } from './suppliers.service';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto): Promise<{
        id: string;
        name: string;
        email: string | null;
        tenantId: string;
        phone: string | null;
        address: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string | null;
        tenantId: string;
        phone: string | null;
        address: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        tenantId: string;
        phone: string | null;
        address: string | null;
    }>;
}
