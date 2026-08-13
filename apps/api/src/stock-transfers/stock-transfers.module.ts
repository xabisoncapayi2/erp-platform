import { StockTransfersController } from "./stock-transfers.controller";
import { Module } from '@nestjs/common';
import { StockTransfersService } from './stock-transfers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [StockTransfersController],
  imports: [PrismaModule],
  providers: [StockTransfersService],
  exports: [StockTransfersService],
})
export class StockTransfersModule {}
