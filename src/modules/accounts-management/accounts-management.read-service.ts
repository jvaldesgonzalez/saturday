import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { TextUtils } from 'src/shared/utils/text.utils';
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
					WITH distinct item as u,l,collect(distinct c.id) as c,me
					OPTIONAL match (u)-[:FRIEND]-(friend:User)
					OPTIONAL match (u)-[:FOLLOW]->(follow:Partner)
					OPTIONAL match (u)-[rfriend:FRIEND|FRIEND_REQUEST]-(me)
					OPTIONAL match (u)<-[rblock:BLOCK]-(me)
					OPTIONAL match (u)-[:FRIEND]-(common:User)-[:FRIEND]-(me)
					RETURN distinct {
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
							friendshipStatus: CASE
														WHEN rfriend is null THEN "none" 
														WHEN toLower(type(rfriend)) = "friend" THEN "friend" 
														WHEN startNode(rfriend)=me THEN "requested"
														ELSE "friend_request" END,
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
					WITH count(distinct u) as followers, item, count(distinct e) as events
					MATCH (me:User)
					WHERE me.id = $meId
					OPTIONAL MATCH (item)-[r:FOLLOW]-(me)
					OPTIONAL MATCH (item)-[:HAS_PLACE]-(place:Place)
					OPTIONAL MATCH (me)-[:FRIEND]-(friend:User)-[:FOLLOW]->(item)
					CALL {
						with me,item
						optional match (me)-[:FRIEND]-(f:User)-[:FOLLOW]->(item)
						return f limit 3
					}
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
							totalFriendsWhoFollowThis: count(distinct friend),
							friends:collect(distinct f{.username, .avatar}),
							contactInfo:item.contactInfo,
							place:place {.name, .address, .latitude, .longitude}
					} as result
				',{item:acc,meId:$meId}) YIELD value
				RETURN distinct value.result
					`,
      )
        .bind({ meId: meId, username: username })
        .map((r) => {
          console.log(r);
          if (r.type === 'user') return r;
          r.aditionalBusinessData = TextUtils.escapeAndParse(
            r.aditionalBusinessData,
          );
          r.contactInfo = TextUtils.escapeAndParse(r.contactInfo);
          if (r.place === null || r.place === undefined) {
            delete r.place;
            return r;
          }
          r.place.latitude = r.place.latitude;
          r.place.longitude = r.place.longitude;
          return r;
        }),
    );
  }
}
