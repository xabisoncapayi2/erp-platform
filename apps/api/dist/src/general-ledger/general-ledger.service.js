"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralLedgerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GeneralLedgerService = class GeneralLedgerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEntry(tenantId, dto, tx) {
        const db = tx || this.prisma;
        const rawLines = dto.lines || dto.entries || [];
        let totalDebit = 0;
        let totalCredit = 0;
        for (const l of rawLines) {
            const debit = Number(l.debit || 0);
            const credit = Number(l.credit || 0);
            if ((debit > 0 && credit > 0) || (debit === 0 && credit === 0)) {
                throw new common_1.BadRequestException('Each line must have exactly one of debit or credit set');
            }
            totalDebit += debit;
            totalCredit += credit;
        }
        if (Math.abs(totalDebit - totalCredit) > 0.001) {
            throw new common_1.BadRequestException('Journal entry does not balance: total debits must equal total credits');
        }
        const data = {
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
    async getTrialBalance(tenantId) {
        const entries = await this.prisma.generalLedgerEntry.findMany({
            where: { tenantId },
            include: { lines: true },
        });
        const lines = entries.flatMap((entry) => entry.lines || []);
        const accountMap = new Map();
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
};
exports.GeneralLedgerService = GeneralLedgerService;
exports.GeneralLedgerService = GeneralLedgerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeneralLedgerService);
//# sourceMappingURL=general-ledger.service.js.map