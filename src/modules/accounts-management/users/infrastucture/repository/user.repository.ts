import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import {
  JWTClaim,
  RefreshToken,
} from 'src/modules/accounts-management/auth/login-payload.type';
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

  async findById(theId: UniqueEntityID): Promise<User> {
    const persistence = await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (l:Location)<-[:IN_LOCATION]-(u:User)-[:PREFER_CATEGORY]->(c:Category)
				WHERE u.id = $theId
				return {
					fullname:u.fullname,
					birthday:u.birthday,
					gender:u.gender,
					categoryPreferences:collect(c.id),
					locationId:l.id,
					authProviderId:u.authProviderId,
					authProvider:u.authProvider,
					username:u.username,
					email:u.email,
					firebasePushId: u.firebasePushId,
					appVersion:u.appVersion,
					isActive:u.isActive,
					avatar:u.avatar,
					refreshToken:u.refreshToken,
					createdAt:u.createdAt,
					updatedAt:u.updatedAt,
					privacyStatus:u.privacyStatus,
					id:u.id
				}`,
      )
        .bind({ theId: theId.toString() })
        .transform(UserEntity),
    );
    return persistence ? UserMappers.fromPersistence(persistence) : null;
  }

  async getPayloadByRefreshToken(token: RefreshToken): Promise<JWTClaim> {
    return await this.persistenceManager.maybeGetOne<JWTClaim>(
      QuerySpecification.withStatement(
        `MATCH (u:User)
				WHERE u.refreshToken = $token
				RETURN u{.id, .email, .username}
			`,
      ).bind({ token }),
    );
  }

  async emailIsTaken(theEmail: string): Promise<boolean> {
    return (await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:User)
			WHERE u.email = $email
				RETURN u.id`,
      ).bind({ email: theEmail }),
    ))
      ? true
      : false;
  }

  async usernameIsTaken(theUsername: string): Promise<boolean> {
    return (await this.persistenceManager.maybeGetOne<UserEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:User)
			WHERE u.username = $username
				RETURN u.id`,
      ).bind({ username: theUsername }),
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
					birthday:u.birthday,
					gender:u.gender,
					categoryPreferences:collect(c.id),
					locationId:l.id,
					authProviderId:u.authProviderId,
					authProvider:u.authProvider,
					username:u.username,
					email:u.email,
					firebasePushId: u.firebasePushId,
					appVersion:u.appVersion,
					isActive:u.isActive,
					avatar:u.avatar,
					refreshToken:u.refreshToken,
					createdAt:u.createdAt,
					updatedAt:u.updatedAt,
					id:u.id
				}`,
      )
        .bind({ theId: theId.toString() })
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
				SET u:Account
				SET u += $data`,
      ).bind({
        uId: persistent.id,
        data,
      }),
    );
    await this.cleanCategoriesAndLocation(theUser._id);
    await Promise.all([
      this.addCategories(theUser._id, theUser.categoryPreferences),
      this.addLocation(theUser._id, theUser.locationId),
    ]);
  }

  private async cleanCategoriesAndLocation(userId: IIdentifier): Promise<void> {
    this._logger.log('Cleaning');
    return await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
				MATCH (u:User)-[rel]-(item)
				WHERE u.id = $userId
				AND (item:Location OR item:Category)
				DELETE rel
				`,
      ).bind({ userId: userId.toString() }),
    );
  }

  private async addCategories(
    userId: IIdentifier,
    categories: CategoryId[],
  ): Promise<void> {
    for (const catId of categories) {
      await this.persistenceManager.execute(
        QuerySpecification.withStatement(
          `MATCH (u:User),(c:Category)
					WHERE u.id = $uId
					AND c.id = $cId
					MERGE (u)-[:PREFER_CATEGORY]->(c)`,
        ).bind({ uId: userId.toString(), cId: catId.toString() }),
      );
    }
  }

  private async addLocation(
    userId: IIdentifier,
    locationId: LocationId,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(l:Location)
					WHERE u.id = $uId
					AND l.id = $lId
					MERGE (u)-[:IN_LOCATION]->(l)`,
      ).bind({ uId: userId.toString(), lId: locationId.toString() }),
    );
  }
}
