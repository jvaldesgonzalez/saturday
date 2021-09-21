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
				OPTIONAL MATCH (p)-[r:FOLLOW]-(me)
				WHERE me.id = $meId
				RETURN distinct {
						id:p.id,
						username:p.username,
						email:p.email,
						avatar:p.avatar,
						businessName:p.businessName,
						aditionalBusinessData:p.aditionalBusinessData,
						followers:followers,
						IFollowThis: r IS NOT null,
						events:events
				}
				`,
      )
        .bind({ pId: partnerId, meId: userRequesterId })
        .map((r) => {
          return {
            ...r,
            aditionalBusinessData: JSON.parse(r.aditionalBusinessData),
          };
        }),
    );
  }
}
