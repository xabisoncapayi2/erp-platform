import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupplierInvoiceStatus } from '@prisma/client';

export interface CreateSupplierInvoiceLineDto {
  purchaseOrderLineId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreateSupplierInvoiceDto {
  supplierId: string;
  purchaseOrderId: string;
  invoiceNumber: string;
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
  dueDate: Date;
  lines: CreateSupplierInvoiceLineDto[];
}

const PRICE_VARIANCE_TOLERANCE = 0.01;

@Injectable()
export class SupplierInvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateSupplierInvoiceDto) {
    const po = await this.prisma.purchaseOrder.findFirst({
      where: { id: dto.purchaseOrderId, tenantId },
      include: { lines: true },
    });
    if (!po) {
      throw new NotFoundException(`Purchase order ${dto.purchaseOrderId} not found.`);
    }
    if (po.supplierId !== dto.supplierId) {
      throw new BadRequestException(
        `Supplier ${dto.supplierId} does not match the supplier on this purchase order.`,
      );
    }
    if (dto.lines.length === 0) {
      throw new BadRequestException('Invoice must have at least one line.');
    }

    return this.prisma.$transaction(async (tx) => {
      for (const invoiceLine of dto.lines) {
        const poLine = po.lines.find((l) => l.id === invoiceLine.purchaseOrderLineId);
        if (!poLine) {
          throw new BadRequestException(
            `PO line ${invoiceLine.purchaseOrderLineId} does not belong to PO ${po.id}.`,
          );
        }
        if (poLine.productId !== invoiceLine.productId) {
          throw new BadRequestException(
            `Product mismatch on line ${invoiceLine.purchaseOrderLineId}.`,
          );
        }

        const alreadyInvoiced = await tx.supplierInvoiceLine.aggregate({
          where: {
            purchaseOrderLineId: poLine.id,
            supplierInvoice: { status: { not: SupplierInvoiceStatus.REJECTED } },
          },
          _sum: { quantity: true },
        });
        const invoicedSoFar = alreadyInvoiced._sum.quantity ?? 0;
        const availableToInvoice = poLine.quantityReceived - invoicedSoFar;

        if (invoiceLine.quantity > availableToInvoice) {
          throw new BadRequestException(
            `Three-way match failed on line ${poLine.id}: invoicing ${invoiceLine.quantity} units, ` +
              `but only ${availableToInvoice} units are available to invoice ` +
              `(received: ${poLine.quantityReceived}, already invoiced: ${invoicedSoFar}). ` +
              `Cannot invoice for goods not yet received.`,
          );
        }

        const priceDelta = Math.abs(invoiceLine.unitPrice - poLine.unitCost.toNumber());
        if (priceDelta > PRICE_VARIANCE_TOLERANCE) {
          throw new BadRequestException(
            `Price variance on line ${poLine.id}: invoiced at R${invoiceLine.unitPrice}, ` +
              `PO agreed price was R${poLine.unitCost}. Variance of R${priceDelta.toFixed(2)} ` +
              `exceeds tolerance of R${PRICE_VARIANCE_TOLERANCE}.`,
          );
        }
      }

      const invoice = await tx.supplierInvoice.create({
        data: {
          tenantId,
          supplierId: dto.supplierId,
          purchaseOrderId: dto.purchaseOrderId,
          invoiceNumber: dto.invoiceNumber,
          status: SupplierInvoiceStatus.PENDING_MATCHING,
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

  async approve(invoiceId: string, tenantId: string) {
    const invoice = await this.prisma.supplierInvoice.findFirst({
      where: { id: invoiceId, tenantId },
    });
    if (!invoice) {
      throw new NotFoundException(`Supplier invoice ${invoiceId} not found.`);
    }
    if (invoice.status !== SupplierInvoiceStatus.PENDING_MATCHING) {
      throw new BadRequestException(
        `Only PENDING_MATCHING invoices can be approved. Current status: ${invoice.status}`,
      );
    }
    return this.prisma.supplierInvoice.update({
      where: { id: invoiceId },
      data: { status: SupplierInvoiceStatus.APPROVED },
    });
  }

  async reject(invoiceId: string, tenantId: string, reason: string) {
    const invoice = await this.prisma.supplierInvoice.findFirst({
      where: { id: invoiceId, tenantId },
    });
    if (!invoice) {
      throw new NotFoundException(`Supplier invoice ${invoiceId} not found.`);
    }
    if (invoice.status === SupplierInvoiceStatus.PAID) {
      throw new BadRequestException('Cannot reject an invoice that has already been paid.');
    }
    return this.prisma.supplierInvoice.update({
      where: { id: invoiceId },
      data: { status: SupplierInvoiceStatus.REJECTED },
    });
  }
}
