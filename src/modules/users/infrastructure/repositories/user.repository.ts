import { Transaction } from 'neo4j-driver';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mapper/user.mapper';

export class UserRepository
  extends BaseRepository<User, UserEntity>
  implements IRepository<User> {
  constructor(transaction: Transaction) {
    super(transaction, 'User', UserMapper.DomainToPersistent, 'UserRepository');
  }
}
