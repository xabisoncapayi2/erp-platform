import { SupplierInvoicesController } from "./supplier-invoices.controller";
import { Module } from '@nestjs/common';
import { SupplierInvoicesService } from './supplier-invoices.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SupplierInvoicesController],
  imports: [PrismaModule],
  providers: [SupplierInvoicesService],
  exports: [SupplierInvoicesService],
})
export class SupplierInvoicesModule {}
