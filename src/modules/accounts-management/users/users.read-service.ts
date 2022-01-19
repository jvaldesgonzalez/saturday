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
					following:count(distinct follow),
					description:u.description,
					privacyStatus:u.privacyStatus
			}
			`,
      )
        .bind({ uId: meId })
        .map((r) => {
          return {
            ...r,
            birthday: r.birthday ? parseDate(r.birthday) : null,
          };
        }),
    );
  }

  //FIXME: review privacy things, when im blocked the user is private for me, etc
  //see startNode(relation) for edge direction
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
			OPTIONAL match (u)-[rfriend:FRIEND|FRIEND_REQUEST]-(me)
			OPTIONAL match (u)<-[rblock:BLOCK]-(me)
			OPTIONAL match (u)-[:FRIEND]-(common:User)-[:FRIEND]-(me)
			RETURN {
					id:u.id,
					username:u.username,
					avatar:u.avatar,
					fullname:u.fullname,
					gender:u.gender,
					location:l.name,
					friends:count(distinct friend),
					following:count(distinct follow),
					description:u.description,
					IBlockedThis:rblock is not null,
					friendsInCommon:count(distinct common),
					friendshipStatus: CASE
														WHEN rfriend is null THEN 'none' 
														WHEN toLower(type(rfriend)) = 'friend' THEN 'friend' 
														WHEN startNode(rfriend)=me THEN 'requested'
														ELSE 'friend_request' END,
					isPrivate: CASE
												WHEN u.privacyStatus = "private" THEN true
												WHEN u.privacyStatus = "public" THEN false
												WHEN (u)-[:FRIEND]-(me) THEN false
												ELSE true
										END
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
