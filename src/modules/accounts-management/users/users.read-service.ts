import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { UserProfile } from './presentation/user-profile';

@Injectable()
export class UsersReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getMyProfile(meId: string): Promise<UserProfile> {
    return await this.persistenceManager.maybeGetOne<UserProfile>(
      QuerySpecification.withStatement(
        `
			MATCH (l:Location)--(u:User)--(c:Category)
			WHERE u.id = $uId
			WITH u,l,collect(distinct c.id) as c
			OPTIONAL match (u)-[:FRIEND]-(friend:User)
			OPTIONAL match (u)-[:FOLLOW]->(follow:Partner)
			RETURN {
					id:u.id,
					username:u.username,
					email:u.email,
					avatar:u.avatar,
					fullname:u.fullname,
					birthday:u.birthday,
					gender:u.gender,
					location:l.id,
					categoryPreferences:c,
					friends:count(distinct friend),
					following:count(distinct follow)
			}
			`,
      )
        .bind({ uId: meId })
        .map((r) => {
          return {
            ...r,
            birthday: parseDate(r.birthday),
          };
        }),
    );
  }

  async getProfile(meId: string, userId: string): Promise<UserProfile> {
    return await this.persistenceManager.maybeGetOne<UserProfile>(
      QuerySpecification.withStatement(
        `
			MATCH (l:Location)--(u:User)--(c:Category)
			WHERE u.id = $uId
			MATCH (me:User)
			WHERE me.id = $meId
			WITH u,l,collect(distinct c.id) as c,me
			OPTIONAL match (u)-[:FRIEND]-(friend:User)
			OPTIONAL match (u)-[:FOLLOW]->(follow:Partner)
			OPTIONAL match (u)-[r]-(me)
			RETURN {
					id:u.id,
					username:u.username,
					avatar:u.avatar,
					fullname:u.fullname,
					gender:u.gender,
					categoryPreferences:c,
					friends:count(distinct friend),
					following:count(distinct follow),
					friendshipStatus: CASE WHEN r is null THEN 'none' ELSE toLower(type(r)) END
			}
			`,
      )
        .bind({ uId: userId, meId: meId })
        .map((r) => {
          return r;
        }),
    );
  }
}
