import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { PartnerProfile } from './partners/presentation/partner-profile';
import { UserProfile } from './users/presentation/user-profile';

export class AccountsManagementReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getAccountByUsername(
    username: string,
    meId: string,
  ): Promise<UserProfile | PartnerProfile> {
    return await this.persistenceManager.maybeGetOne<
      UserProfile | PartnerProfile
    >(
      QuerySpecification.withStatement(
        `
				MATCH (acc:Account)
				WHERE acc.username = $username
				CALL apoc.when(acc:User,'
					MATCH (l:Location)--(item)--(c:Category)
					MATCH (me:User)
					WHERE me.id = $meId
					WITH item as u,l,collect(distinct c.id) as c,me
					OPTIONAL match (u)-[:FRIEND]-(friend:User)
					OPTIONAL match (u)-[:FOLLOW]->(follow:Partner)
					OPTIONAL match (u)-[rfriend:FRIEND|FRIEND_REQUEST]-(me)
					OPTIONAL match (u)<-[rblock:BLOCK]-(me)
					OPTIONAL match (u)-[:FRIEND]-(common:User)-[:FRIEND]-(me)
					RETURN {
							type:"user",
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
							friendshipStatus: CASE WHEN rfriend is null THEN "none" ELSE toLower(type(rfriend)) END,
							isPrivate: CASE
														WHEN u.privacyStatus = "private" THEN true
														WHEN u.privacyStatus = "public" THEN false
														WHEN (u)-[:FRIEND]-(me) THEN false
														ELSE true
												END
					} as result
				','
					OPTIONAL MATCH (u:User)-[:FOLLOW]->(item)
					OPTIONAL MATCH (item)-[:PUBLISH_EVENT]->(e:Event)
					WITH count(distinct u) as followers, item, count(e) as events
					MATCH (me:User)
					WHERE me.id = $meId
					OPTIONAL MATCH (item)-[r:FOLLOW]-(me)
					OPTIONAL MATCH (item)-[:HAS_PLACE]-(place:Place)
					RETURN distinct {
							type:"partner",
							id:item.id,
							username:item.username,
							email:item.email,
							avatar:item.avatar,
							businessName:item.businessName,
							aditionalBusinessData:item.aditionalBusinessData,
							followers:followers,
							IFollowThis: r IS NOT null,
							events:events,
							place:place {.name, .address, .latitude, .longitude}
					} as result
				',{item:acc,meId:$meId}) YIELD value
				RETURN distinct value.result
					`,
      )
        .bind({ meId: meId, username: username })
        .map((r) => {
          if (r.type === 'user') return r;
          r.aditionalBusinessData = JSON.parse(r.aditionalBusinessData);
          if (r.place === null || r.place === undefined) {
            delete r.place;
            return r;
          }
          r.place.latitude = parseFloat(r.place.latitude);
          r.place.longitude = parseFloat(r.place.longitude);
          return r;
        }),
    );
  }
}