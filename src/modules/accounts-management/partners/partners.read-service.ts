import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { TextUtils } from 'src/shared/utils/text.utils';
import {
  PartnerMyProfile,
  PartnerProfile,
} from './presentation/partner-profile';

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
				WITH count(distinct u) as followers, p, count(distinct e) as events
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
						contactInfo:p.contactInfo,
						place:place {.name, .address, .latitude, .longitude}
				}
				`,
      )
        .bind({ pId: partnerId, meId: userRequesterId })
        .map((r) => {
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

  async getMyProfile(partnerId: string): Promise<PartnerMyProfile> {
    return await this.persistenceManager.maybeGetOne<PartnerMyProfile>(
      QuerySpecification.withStatement(
        `
				MATCH (p:Partner)
				WHERE p.id = $pId
				OPTIONAL MATCH (u:User)-[:FOLLOW]->(p)
				OPTIONAL MATCH (p)-[:PUBLISH_EVENT]->(e:Event)
				WITH count(distinct u) as followers, p, count(distinct e) as events
				OPTIONAL MATCH (p)-[:HAS_PLACE]-(place:Place)
				RETURN p{
						.id,
						.username,
						.email,
						.avatar,
						.businessName,
						.aditionalBusinessData,
						followers:followers,
						events:events,
						place:place {.name, .address, .latitude, .longitude}
				}
				`,
      )
        .bind({ pId: partnerId })
        .map((r) => {
          r.aditionalBusinessData = TextUtils.escapeAndParse(
            r.aditionalBusinessData,
          );
          // r.contactInfo = TextUtils.escapeAndParse(r.contactInfo);
          if (r.place === null || r.place === undefined) {
            delete r.place;
            return r;
          }
          return r;
        }),
    );
  }
}
