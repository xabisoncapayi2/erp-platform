export declare class CreateGlLineDto {
    accountCode: string;
    debit: number;
    credit: number;
}
export declare class CreateGlEntryDto {
    description: string;
    reference?: string;
    lines: CreateGlLineDto[];
}
