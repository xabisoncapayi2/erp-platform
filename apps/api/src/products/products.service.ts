import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProductDto {
  name: string;
  sku: string;
  price?: number;
  unitPrice?: number;
  unitCost?: number;
  stockQuantity?: number;
  tenantId?: string;
  [key: string]: any;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureTenant(tenantId: string) {
    if (!tenantId) return;
    const p = this.prisma as any;
    try {
      if (p.tenant) {
        const t = await p.tenant.findUnique({ where: { id: tenantId } });
        if (!t) {
          await p.tenant.create({ data: { id: tenantId, name: tenantId, slug: tenantId } }).catch(() => {});
        }
      }
    } catch {}
  }

  async create(tenantIdOrDto: any, optionalDto?: any) {
    let tenantId: string;
    let dto: any;

    if (typeof tenantIdOrDto === 'string') {
      tenantId = tenantIdOrDto;
      dto = optionalDto || {};
    } else {
      dto = tenantIdOrDto || {};
      tenantId = dto.tenantId || 'tenant_alpha';
    }

    await this.ensureTenant(tenantId);

    const unitPrice = dto.unitPrice ?? dto.price ?? 0;
    const unitCost = dto.unitCost ?? dto.price ?? 0;
    const { price, stockQuantity, tenantId: _, ...rest } = dto;

    try {
      return await (this.prisma as any).product.create({
        data: {
          tenantId,
          ...rest,
          unitPrice,
          unitCost,
        },
      });
    } catch (err: any) {
      throw new BadRequestException(err.message || err);
    }
  }

  async findAll(tenantId?: string) {
    if (tenantId) {
      return (this.prisma as any).product.findMany({ where: { tenantId } });
    }
    return (this.prisma as any).product.findMany();
  }

  async findOne(idOrTenant: string, optionalId?: string) {
    let tenantId: string | undefined;
    let id: string;

    if (optionalId) {
      tenantId = idOrTenant;
      id = optionalId;
    } else {
      id = idOrTenant;
    }

    if (tenantId) {
      return (this.prisma as any).product.findFirst({ where: { id, tenantId } });
    }
    return (this.prisma as any).product.findFirst({ where: { id } });
  }
}
