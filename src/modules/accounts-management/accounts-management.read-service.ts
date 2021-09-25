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
					WITH item,l,collect(distinct c.id) as c
					OPTIONAL match (item)-[:FRIEND]-(friend:User)
					OPTIONAL match (item)-[:FOLLOW]->(follow:Partner)
					MATCH (me:User)
					WHERE me.id = $meId
					OPTIONAL match (item)-[r]-(me)
					RETURN {
							type:"user",
							id:item.id,
							username:item.username,
							avatar:item.avatar,
							fullname:item.fullname,
							gender:item.gender,
							categoryPreferences:c,
							friends:count(distinct friend),
							following:count(distinct follow),
							friendshipStatus: CASE WHEN r is null THEN "none" ELSE toLower(type(r)) END
					} as result
				','
					OPTIONAL MATCH (u:User)-[:FOLLOW]->(item)
					OPTIONAL MATCH (item)-[:PUBLISH_EVENT]->(e:Event)
					WITH count(distinct u) as followers, item, count(e) as events
					MATCH (me:User)
					WHERE me.id = $meId
					OPTIONAL MATCH (item)-[r:FOLLOW]-(me)
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
							events:events
					} as result
				',{item:acc,meId:$meId}) YIELD value
				RETURN distinct value.result
					`,
      )
        .bind({ meId: meId, username: username })
        .map((r) => {
          if (r.type === 'partner')
            return {
              ...r,
              aditionalBusinessData: JSON.parse(r.aditionalBusinessData),
            };
          return r;
        }),
    );
  }
}
