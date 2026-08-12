import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Supplier } from '@prisma/client';

export class CreateSupplierDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: CreateSupplierDto): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: {
        tenantId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
  }

  async findAll(tenantId: string): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      where: { tenantId },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Supplier | null> {
    return this.prisma.supplier.findFirst({
      where: { id, tenantId },
    });
  }
}
