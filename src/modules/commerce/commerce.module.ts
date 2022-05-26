import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import https from 'https';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import { PaymentMethodsController } from './payment-methods/payment-methods.controller';
import { PaymentMethodsReadService } from './payment-methods/payment-methods.read-service';
import reservationUseCases from './reservations/application/use-cases';
import { ReservationsRepository } from './reservations/infrastructure/repository/reservations.repository';
import { ReservationRepositoryFactory } from './reservations/infrastructure/repository/reservations.repository.factory';
import { ReservationProviders } from './reservations/providers/providers.enum';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsReadService } from './reservations/reservations.read-service';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }),
  ],
  providers: [
    ReservationsReadService,
    PaymentMethodsReadService,
    {
      provide: ReservationProviders.IReservationsRepository,
      useClass: ReservationsRepository,
    },
    {
      provide: ReservationProviders.IReservationRepositoryFactory,
      useClass: ReservationRepositoryFactory,
    },
    {
      provide: ReservationProviders.IReservationUnitOfWorkFactory,
      useClass: Neo4jUnitOfWorkFactory,
    },
    ...reservationUseCases,
  ],
  controllers: [ReservationsController, PaymentMethodsController],
})
export class CommerceModule {}
