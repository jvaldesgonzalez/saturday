import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { User } from '../../domain/entities/user.entity';
import { Username } from '../../domain/value-objects';
import { UserEmail } from '../../domain/value-objects/user-email.value';
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
  public async existsById(id: UniqueEntityID): Promise<boolean> {
    const res = await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:User)
      WHERE u.id = $id
      RETURN u`,
      )
        .bind({
          id: id.toString(),
        })
        .transform(UserEntity),
    );
    return !!res ? true : false;
  }

  public async findById(id: UniqueEntityID): Promise<User> {
    const res = await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `
      MATCH (u:User)
      WHERE u.id = $id
      RETURN u`,
      )
        .bind({ id: id.toString() })
        .transform(UserEntity),
    );
    return res ? UserMapper.PersistentToDomain(res) : null;
  }

  public async existByUsername(username: Username): Promise<boolean> {
    const res = await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:User)
      WHERE u.username = $username
      RETURN u`,
      )
        .bind({
          username: username.value,
        })
        .transform(UserEntity),
    );
    return !!res ? true : false;
  }

  public async findOneByEmail(emailOrUsername: UserEmail): Promise<User> {
    const res = await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `
      MATCH (u:User)
      WHERE u.email = $value OR e.username = $value
      RETURN u`,
      )
        .bind({ value: emailOrUsername.value })
        .transform(UserEntity),
    );
    return res ? UserMapper.PersistentToDomain(res) : null;
  }

  public async existByEmail(email: UserEmail): Promise<boolean> {
    const res = await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:User)
      WHERE u.email = $email
      RETURN u`,
      )
        .bind({
          email: email.value,
        })
        .transform(UserEntity),
    );
    return !!res ? true : false;
  }
}
