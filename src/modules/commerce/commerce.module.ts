import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import * as https from 'https';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import paymentUseCases from './payments/application/use-cases';
import { PaymentsRepository } from './payments/infrastructure/repository/payments.repository';
import { PaymentRepositoryFactory } from './payments/infrastructure/repository/payments.repository.factory';
import { PaymentController } from './payments/payments.controller';
import { PaymentProviders } from './payments/providers/providers.enum';
import { EnzonaPaymentService } from './payments/services/enzona/enzona.service';
import { PurchasesController } from './purchases/purchases.controller';
import { PurchasesReadService } from './purchases/purchases.read-service';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }),
  ],
  providers: [
    PurchasesReadService,
    {
      provide: PaymentProviders.IPaymentsRepository,
      useClass: PaymentsRepository,
    },
    {
      provide: PaymentProviders.IPaymentRepositoryFactory,
      useClass: PaymentRepositoryFactory,
    },
    {
      provide: PaymentProviders.IPaymentUnitOfWorkFactory,
      useClass: Neo4jUnitOfWorkFactory,
    },
    {
      provide: PaymentProviders.IPaymentService,
      useClass: EnzonaPaymentService,
    },
    ...paymentUseCases,
  ],
  controllers: [PurchasesController, PaymentController],
})
export class CommerceModule {}
