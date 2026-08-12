import { GeneralLedgerService } from './general-ledger.service';
import { CreateGlEntryDto } from './dto/create-gl-entry.dto';
export declare class GeneralLedgerController {
    private readonly glService;
    constructor(glService: GeneralLedgerService);
    createEntry(tenantId: string, dto: CreateGlEntryDto): Promise<any>;
    getTrialBalance(tenantId: string): Promise<{
        accountCode: string;
        debit: number;
        credit: number;
    }[]>;
}
