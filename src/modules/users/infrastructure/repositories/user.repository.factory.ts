import { UserRepository } from './user.repository';
import { User } from '../../domain/entities/user.entity';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { OrmName } from 'src/shared/modules/data-access/enums/orm-names.enum';
import { IUserRepository } from './interface/user.repository.interface';
import { PersistenceManager } from '@liberation-data/drivine';

export class UserRepositoryFactory
  implements IRepositoryFactory<User, IUserRepository> {
  getOrmName(): string {
    return OrmName.NEO4J_DRIVINE;
  }

  build(txManager: PersistenceManager): IUserRepository {
    return new UserRepository(txManager);
  }
}
