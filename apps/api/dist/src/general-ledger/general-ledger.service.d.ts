import { PrismaService } from '../prisma/prisma.service';
export interface GLEntryLineDto {
    accountCode: string;
    debit: number;
    credit: number;
}
export interface CreateGLEntryDto {
    description?: string;
    reference?: string;
    lines?: GLEntryLineDto[];
    entries?: GLEntryLineDto[];
    [key: string]: any;
}
export declare class GeneralLedgerService {
    private prisma;
    constructor(prisma: PrismaService);
    createEntry(tenantId: string, dto: CreateGLEntryDto, tx?: any): Promise<any>;
    getTrialBalance(tenantId: string): Promise<{
        accountCode: string;
        debit: number;
        credit: number;
    }[]>;
}
