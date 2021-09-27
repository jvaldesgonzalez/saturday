import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PartnerProfile } from './presentation/partner-profile';

@Injectable()
export class PartnersReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getProfile(
    partnerId: string,
    userRequesterId: string,
  ): Promise<PartnerProfile> {
    return await this.persistenceManager.maybeGetOne<PartnerProfile>(
      QuerySpecification.withStatement(
        `
				MATCH (p:Partner)
				WHERE p.id = $pId
				OPTIONAL MATCH (u:User)-[:FOLLOW]->(p)
				OPTIONAL MATCH (p)-[:PUBLISH_EVENT]->(e:Event)
				WITH count(distinct u) as followers, p, count(e) as events
				MATCH (me:User)
				WHERE me.id = $meId

				OPTIONAL MATCH (p)-[r:FOLLOW]-(me)
				OPTIONAL MATCH (p)-[:HAS_PLACE]-(place:Place)
				OPTIONAL MATCH (me)-[:FRIEND]-(friend:User)-[:FOLLOW]->(p)
				CALL {
					with me,p
					optional match (me)-[:FRIEND]-(f:User)-[:FOLLOW]->(p)
					return f limit 3
				}
				RETURN distinct {
						id:p.id,
						username:p.username,
						email:p.email,
						avatar:p.avatar,
						businessName:p.businessName,
						aditionalBusinessData:p.aditionalBusinessData,
						amountOfFollowers:followers,
						IFollowThis: r IS NOT null,
						events:events,
						totalFriendsWhoFollowThis: count(distinct friend),
						friends:collect(distinct f{.username, .avatar}),
						place:place {.name, .address, .latitude, .longitude}
				}
				`,
      )
        .bind({ pId: partnerId, meId: userRequesterId })
        .map((r) => {
          console.log(r);
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
