import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { IIdentifier } from 'src/shared/domain/Identifier';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { IUserRepository } from '../../application/interfaces/user.repository.interface';
import { User } from '../../domain/user.domain';
import { CategoryId } from '../../domain/value-objects/category-id.value';
import { LocationId } from '../../domain/value-objects/location-id.value';
import { UserEntity } from '../entities/user.entity';
import { UserMappers } from '../mappers/user.mapper';

export class UserRepository
  extends BaseRepository<User, UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'User',
      UserMappers.toPersistence,
      'UserRepository',
      persistenceManager,
    );
  }

  async emailIsTaken(theEmail: string): Promise<boolean> {
    return (await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:User)
			WHERE u.email = $email`,
      ).bind({ email: theEmail }),
    ))
      ? true
      : false;
  }
  async findByAuthProviderId(theId: UniqueEntityID): Promise<User> {
    const persistence = await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (l:Location)<-[:IN_LOCATION]-(u:User)-[:PREFER_CATEGORY]->(c:Category)
				WHERE u.authProviderId = $theId
				return {
					fullname:u.fullname,
					birthdat:u.birthdat,
					gender:u.gender,
					categoryPreferences:collect(c.id),
					locationId:l.id,
					authProviderId:u.authProviderId,
					authProvider:u.authProvider,
					username:u.username,
					email:u.email,
					firebasePushId: u.firebasePushId,
					appVersion:u.appVerion,
					isActive:u.isActive,
					avatar:u.avatar,
					refreshToken:u.refreshToken
				}`,
      )
        .bind({ theId })
        .transform(UserEntity),
    );

    return persistence ? UserMappers.fromPersistence(persistence) : null;
  }

  @Transactional()
  async save(theUser: User): Promise<void> {
    const persistent = UserMappers.toPersistence(theUser);
    const { locationId, categoryPreferences, ...data } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MERGE (u:User {id:$uId})
			SET u += $data`,
      ).bind({
        uId: persistent.id,
        data,
      }),
    );
    await this.addCategories(theUser._id, theUser.categoryPreferences);
    await this.addLocation(theUser._id, theUser.locationId);
  }

  private async addCategories(
    userId: IIdentifier,
    categories: CategoryId[],
  ): Promise<void> {
    return;
  }

  private async addLocation(
    userId: IIdentifier,
    locationId: LocationId,
  ): Promise<void> {}
}
