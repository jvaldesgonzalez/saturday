import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import * as https from 'https';
import { EnzonaPaymentService } from './payments/services/enzona/enzona.service';
import { PaymentController } from './payments/services/payments.controller';
import { PurchasesController } from './purchases/purchases.controller';
import { PurchasesReadService } from './purchases/purchases.read-service';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }),
  ],
  providers: [PurchasesReadService, EnzonaPaymentService],
  controllers: [PurchasesController, PaymentController],
})
export class CommerceModule {}
