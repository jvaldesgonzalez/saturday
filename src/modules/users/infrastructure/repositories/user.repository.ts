import { Transaction } from 'neo4j-driver';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { User } from '../../domain/entities/user.entity';
import { UserEmail } from '../../domain/value-objects/user-email.value';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mapper/user.mapper';
import { IUserRepository } from './interface/user.repository.interface';

export class UserRepository
  extends BaseRepository<User, UserEntity>
  implements IUserRepository {
  constructor(transaction: Transaction) {
    super(transaction, 'User', UserMapper.DomainToPersistent, 'UserRepository');
  }
  public async existByEmail(email: UserEmail): Promise<boolean> {
    const result = await this.transaction.run(
      `MATCH (n:User {email:$email}) RETURN n`,
      { email: email.value },
    );
    return result.records.length != 0;
  }
}
