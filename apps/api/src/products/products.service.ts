import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: any, tenantId?: string) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        ...(tenantId ? { tenantId } : {}),
      },
    });
  }

  async findAll(tenantId?: string) {
    return this.prisma.product.findMany({
      where: tenantId ? { tenantId } : {},
    });
  }

  async findOne(id: string, tenantId?: string) {
    return this.prisma.product.findFirst({
      where: {
        id,
        ...(tenantId ? { tenantId } : {}),
      },
    });
  }
}
