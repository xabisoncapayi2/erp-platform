import { Injectable, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class GeneralLedgerService {
  constructor(private prisma: PrismaService) {}

  async createEntry(tenantId: string, dto: CreateGLEntryDto, tx?: any) {
    const db = tx || this.prisma;
    const rawLines = dto.lines || dto.entries || [];

    let totalDebit = 0;
    let totalCredit = 0;

    for (const l of rawLines) {
      const debit = Number(l.debit || 0);
      const credit = Number(l.credit || 0);

      if ((debit > 0 && credit > 0) || (debit === 0 && credit === 0)) {
        throw new BadRequestException('Each line must have exactly one of debit or credit set');
      }

      totalDebit += debit;
      totalCredit += credit;
    }

    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new BadRequestException('Journal entry does not balance: total debits must equal total credits');
    }

    const data: any = {
      tenantId,
      description: dto.description || '',
      lines: {
        create: rawLines.map((l) => ({
          accountCode: l.accountCode,
          debit: Number(l.debit || 0),
          credit: Number(l.credit || 0),
        })),
      },
    };

    if (dto.reference) {
      data.reference = dto.reference;
    }

    return db.generalLedgerEntry.create({
      data,
      include: { lines: true },
    });
  }

  async getTrialBalance(tenantId: string) {
    const entries = await this.prisma.generalLedgerEntry.findMany({
      where: { tenantId },
      include: { lines: true },
    });

    const lines = entries.flatMap((entry) => entry.lines || []);
    const accountMap = new Map<string, { accountCode: string; debit: number; credit: number }>();

    for (const line of lines) {
      const existing = accountMap.get(line.accountCode) || {
        accountCode: line.accountCode,
        debit: 0,
        credit: 0,
      };
      existing.debit += Number(line.debit || 0);
      existing.credit += Number(line.credit || 0);
      accountMap.set(line.accountCode, existing);
    }

    return Array.from(accountMap.values());
  }
}
