import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
