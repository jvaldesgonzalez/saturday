import { PersistenceManager } from '@liberation-data/drivine';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { OrmName } from 'src/shared/modules/data-access/enums/orm-names.enum';
import { IPaymentsRepository } from '../../application/interfaces/payments.repository.interface';
import { Payment } from '../../domain/payment.domain';
import { PaymentsRepository } from './payments.repository';

export class PaymentRepositoryFactory
  implements IRepositoryFactory<Payment, IPaymentsRepository>
{
  getOrmName(): string {
    return OrmName.NEO4J_DRIVINE;
  }

  build(txMananger: PersistenceManager): IPaymentsRepository {
    return new PaymentsRepository(txMananger);
  }
}
