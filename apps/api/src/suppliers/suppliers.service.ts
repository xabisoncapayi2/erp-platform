import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateSupplierDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tenantId?: string;
  [key: string]: any;
}

@Injectable()
export class SuppliersService {
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
    try {
      return await (this.prisma as any).supplier.create({
        data: { tenantId, ...dto },
      });
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(tenantId?: string) {
    if (tenantId) {
      return (this.prisma as any).supplier.findMany({ where: { tenantId } });
    }
    return (this.prisma as any).supplier.findMany();
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
      return (this.prisma as any).supplier.findFirst({ where: { id, tenantId } });
    }
    return (this.prisma as any).supplier.findFirst({ where: { id } });
  }
}
