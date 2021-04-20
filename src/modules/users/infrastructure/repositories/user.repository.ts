import {
  InjectPersistenceManager,
  PersistenceManager,
} from '@liberation-data/drivine';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { User } from '../../domain/entities/user.entity';
import { UserEmail } from '../../domain/value-objects/user-email.value';
import { Username } from '../../domain/value-objects/username.value';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mapper/user.mapper';
import { IUserRepository } from './interface/user.repository.interface';

export class UserRepository
  extends BaseRepository<User, UserEntity>
  implements IUserRepository {
  constructor(
    @InjectPersistenceManager() readonly persistenceManager: PersistenceManager,
  ) {
    super(
      'User',
      UserMapper.DomainToPersistent,
      'UserRepository',
      persistenceManager,
    );
  }
  public async findOneByEmailOrUsername(
    emailOrUsername: UserEmail | Username,
  ): Promise<User> {
    return null;
  }

  public async existByEmail(email: UserEmail): Promise<boolean> {
    return true;
  }
}
