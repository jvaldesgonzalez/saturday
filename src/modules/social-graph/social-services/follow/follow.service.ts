import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { Followee, FollowInteraction } from './follow.interaction';

@Injectable()
export class FollowService
  implements ISocialGraphService<Followee, FollowInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getOutgoings(
    from: UniqueEntityID,
    skip: number,
    limit: number,
    searchTerm: string = '',
  ): Promise<PaginatedFindResult<Followee>> {
    const items = await this.persistenceManager.query<Followee>(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:FOLLOW]->(p:Partner)
				WHERE u.id = $uId AND (p.username STARTS WITH $search OR p.businessName STARTS WITH $search)
				OPTIONAL MATCH (p)<-[:FOLLOW]-(o:User)

				RETURN distinct {
					id:p.id,
					username:p.username,
					email:p.email,
					avatar:p.avatar,
					businessName:p.businessName,
					amountOfFollowers: count(distinct o),
					followSince:r.createdAt
					}
					SKIP $skip
					LIMIT $limit
				`,
      )
        .bind({
          uId: from.toString(),
          search: searchTerm,
          skip: Integer.fromInt(skip),
          limit: Integer.fromInt(limit),
        })
        .map((r) => {
          return { ...r, followSince: parseDate(r.followSince) };
        }),
    );
    console.log(items);
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[:FOLLOW]->(p:Partner)
					WHERE u.id = $uId
				return count(p)
				`,
      ).bind({ uId: from.toString() }),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }

  async save(
    from: UniqueEntityID,
    interaction: FollowInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(p:Partner)
				WHERE u.id = $uId AND p.id = $pId
				MERGE (u)-[:FOLLOW createdAt: datetime()]->(p)`,
      ).bind({ uId: from.toString(), pId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: FollowInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:FOLLOW]->(p:Partner)
				WHERE u.id = $uId AND p.id = $pId
				DELETE r
				`,
      ).bind({ uId: from.toString(), pId: interaction.to.toString() }),
    );
  }

  async isPosible(interaction: FollowInteraction): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:Partner)
				WHERE n.id = $pId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ pId: interaction.to.toString() }),
    );
  }
}
