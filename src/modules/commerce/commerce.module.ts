import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases/purchases.controller';
import { PurchasesReadService } from './purchases/purchases.read-service';

@Module({
  providers: [PurchasesReadService, HttpModule],
  controllers: [PurchasesController],
})
export class CommerceModule {}
