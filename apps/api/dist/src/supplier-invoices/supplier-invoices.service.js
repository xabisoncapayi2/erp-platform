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
exports.SupplierInvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const PRICE_VARIANCE_TOLERANCE = 0.01;
let SupplierInvoicesService = class SupplierInvoicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        const po = await this.prisma.purchaseOrder.findFirst({
            where: { id: dto.purchaseOrderId, tenantId },
            include: { lines: true },
        });
        if (!po) {
            throw new common_1.NotFoundException(`Purchase order ${dto.purchaseOrderId} not found.`);
        }
        if (po.supplierId !== dto.supplierId) {
            throw new common_1.BadRequestException(`Supplier ${dto.supplierId} does not match the supplier on this purchase order.`);
        }
        if (dto.lines.length === 0) {
            throw new common_1.BadRequestException('Invoice must have at least one line.');
        }
        return this.prisma.$transaction(async (tx) => {
            for (const invoiceLine of dto.lines) {
                const poLine = po.lines.find((l) => l.id === invoiceLine.purchaseOrderLineId);
                if (!poLine) {
                    throw new common_1.BadRequestException(`PO line ${invoiceLine.purchaseOrderLineId} does not belong to PO ${po.id}.`);
                }
                if (poLine.productId !== invoiceLine.productId) {
                    throw new common_1.BadRequestException(`Product mismatch on line ${invoiceLine.purchaseOrderLineId}.`);
                }
                const alreadyInvoiced = await tx.supplierInvoiceLine.aggregate({
                    where: {
                        purchaseOrderLineId: poLine.id,
                        supplierInvoice: { status: { not: client_1.SupplierInvoiceStatus.REJECTED } },
                    },
                    _sum: { quantity: true },
                });
                const invoicedSoFar = alreadyInvoiced._sum.quantity ?? 0;
                const availableToInvoice = poLine.quantityReceived - invoicedSoFar;
                if (invoiceLine.quantity > availableToInvoice) {
                    throw new common_1.BadRequestException(`Three-way match failed on line ${poLine.id}: invoicing ${invoiceLine.quantity} units, ` +
                        `but only ${availableToInvoice} units are available to invoice ` +
                        `(received: ${poLine.quantityReceived}, already invoiced: ${invoicedSoFar}). ` +
                        `Cannot invoice for goods not yet received.`);
                }
                const priceDelta = Math.abs(invoiceLine.unitPrice - poLine.unitCost.toNumber());
                if (priceDelta > PRICE_VARIANCE_TOLERANCE) {
                    throw new common_1.BadRequestException(`Price variance on line ${poLine.id}: invoiced at R${invoiceLine.unitPrice}, ` +
                        `PO agreed price was R${poLine.unitCost}. Variance of R${priceDelta.toFixed(2)} ` +
                        `exceeds tolerance of R${PRICE_VARIANCE_TOLERANCE}.`);
                }
            }
            const invoice = await tx.supplierInvoice.create({
                data: {
                    tenantId,
                    supplierId: dto.supplierId,
                    purchaseOrderId: dto.purchaseOrderId,
                    invoiceNumber: dto.invoiceNumber,
                    status: client_1.SupplierInvoiceStatus.PENDING_MATCHING,
                    subTotal: dto.subTotal,
                    taxTotal: dto.taxTotal,
                    grandTotal: dto.grandTotal,
                    dueDate: dto.dueDate,
                    lines: {
                        create: dto.lines.map((l) => ({
                            purchaseOrderLineId: l.purchaseOrderLineId,
                            productId: l.productId,
                            quantity: l.quantity,
                            unitPrice: l.unitPrice,
                            total: l.total,
                        })),
                    },
                },
                include: { lines: true },
            });
            return invoice;
        });
    }
    async approve(invoiceId, tenantId) {
        const invoice = await this.prisma.supplierInvoice.findFirst({
            where: { id: invoiceId, tenantId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Supplier invoice ${invoiceId} not found.`);
        }
        if (invoice.status !== client_1.SupplierInvoiceStatus.PENDING_MATCHING) {
            throw new common_1.BadRequestException(`Only PENDING_MATCHING invoices can be approved. Current status: ${invoice.status}`);
        }
        return this.prisma.supplierInvoice.update({
            where: { id: invoiceId },
            data: { status: client_1.SupplierInvoiceStatus.APPROVED },
        });
    }
    async reject(invoiceId, tenantId, reason) {
        const invoice = await this.prisma.supplierInvoice.findFirst({
            where: { id: invoiceId, tenantId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Supplier invoice ${invoiceId} not found.`);
        }
        if (invoice.status === client_1.SupplierInvoiceStatus.PAID) {
            throw new common_1.BadRequestException('Cannot reject an invoice that has already been paid.');
        }
        return this.prisma.supplierInvoice.update({
            where: { id: invoiceId },
            data: { status: client_1.SupplierInvoiceStatus.REJECTED },
        });
    }
};
exports.SupplierInvoicesService = SupplierInvoicesService;
exports.SupplierInvoicesService = SupplierInvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupplierInvoicesService);
//# sourceMappingURL=supplier-invoices.service.js.map