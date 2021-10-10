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
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import {
  FriendRequestInteraction,
  Requester,
} from './friend-request.interaction';

@Injectable()
export class FriendRequestService
  implements ISocialGraphService<Requester, FriendRequestInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async getOutgoings(
    from: UniqueEntityID,
    skip: number,
    limit: number,
    searchTerm = '',
  ): Promise<PaginatedFindResult<Requester>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<any>(
        QuerySpecification.withStatement(
          `MATCH (u:User)<-[r:FRIEND_REQUEST]-(requester:User)
				WHERE u.id = $uId AND (requester.username STARTS WITH $search OR requester.fullname STARTS WITH $search)
					WITH u,requester,r
					OPTIONAL MATCH (requester)-[:FRIEND]-(common:User)-[:FRIEND]-(u)
				RETURN distinct {
					id:requester.id,
					username:requester.username,
					email:requester.email,
					avatar:requester.avatar,
					fullname:requester.fullname,
					requestedAt:r.createdAt,
					friendsInCommon:count(distinct common)
					} as result
					ORDER BY result.friendsInCommon DESC
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
            return { ...r, requestedAt: parseDate(r.requestedAt) };
          }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `MATCH (u:User)<-[:FRIEND_REQUEST]-(o:User)
					WHERE u.id = $uId
				return count(o)
				`,
        ).bind({ uId: from.toString() }),
      ),
    ]);
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
  async save(
    from: UniqueEntityID,
    interaction: FriendRequestInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(f:User)
				WHERE u.id = $uId AND f.id = $fId
				MERGE (u)-[r:FRIEND_REQUEST]->(f)
				SET r.createdAt = datetime()`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: FriendRequestInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:FRIEND_REQUEST]->(f:User)
				WHERE u.id = $uId AND f.id = $fId
				DELETE r
				`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async isPosible(
    interaction: FriendRequestInteraction,
    from: SocialGraphNode,
  ): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:User)-[:FRIEND_REQUEST]-(sender:User)
				WHERE n.id = $fId AND sender.id = $senderId
				CALL apoc.when(n is not null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ fId: interaction.to.toString(), senderId: from.toString() }),
    );
  }
}
