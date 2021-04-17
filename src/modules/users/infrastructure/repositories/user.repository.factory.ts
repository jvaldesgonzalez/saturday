import { UserRepository } from './user.repository';
import { User } from '../../domain/entities/user.entity';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { Transaction } from 'neo4j-driver';
import { OrmName } from 'src/shared/modules/data-access/enums/orm-names.enum';
import { IUserRepository } from './interface/user.repository.interface';

export class UserRepositoryFactory
  implements IRepositoryFactory<User, IUserRepository> {
  getOrmName(): string {
    return OrmName.NEO4J_DRIVER;
  }

  build(transaction: Transaction): IUserRepository {
    return new UserRepository(transaction);
  }
}
