import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases/purchases.controller';
import { PurchasesReadService } from './purchases/purchases.read-service';

@Module({
  providers: [PurchasesReadService],
  controllers: [PurchasesController],
})
export class CommerceModule {}
