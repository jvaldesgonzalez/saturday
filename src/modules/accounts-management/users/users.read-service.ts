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

  async getProfile(userId: string): Promise<UserProfile> {
    return await this.persistenceManager.maybeGetOne<UserProfile>(
      QuerySpecification.withStatement(
        `
			MATCH (l:Location)--(u:User)--(c:Category)
			WHERE u.id = "777cc88c-2e3f-4eb4-ac81-14c9323c541d"
			WITH u,l,collect(c.id) as c
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
      ).map((r) => {
        return {
          ...r,
          birthday: parseDate(r.birthday),
        };
      }),
    );
  }
}
