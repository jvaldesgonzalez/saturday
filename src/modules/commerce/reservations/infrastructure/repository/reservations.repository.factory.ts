import { PersistenceManager } from '@liberation-data/drivine';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { OrmName } from 'src/shared/modules/data-access/enums/orm-names.enum';
import { IReservationsRepository } from '../../application/interfaces/payments.repository.interface';
import { Reservation } from '../../domain/reservation.domain';
import { ReservationsRepository } from './reservations.repository';

export class ReservationRepositoryFactory
  implements IRepositoryFactory<Reservation, IReservationsRepository>
{
  getOrmName(): string {
    return OrmName.NEO4J_DRIVINE;
  }

  build(txMananger: PersistenceManager): IReservationsRepository {
    return new ReservationsRepository(txMananger);
  }
}
