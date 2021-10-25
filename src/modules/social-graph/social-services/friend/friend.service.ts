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
import { UserInteractor } from '../../common/user.interactor';
import { Friend, FriendInteraction } from './friend.interaction';

@Injectable()
export class FriendService
  implements ISocialGraphService<Friend, FriendInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async getOutgoings(
    from: UniqueEntityID,
    skip: number,
    limit: number,
    searchTerm = '',
  ): Promise<PaginatedFindResult<Friend>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<any>(
        QuerySpecification.withStatement(
          `MATCH (u:User)-[r:FRIEND]-(requester:User)
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
          `MATCH (u:User)-[:FRIEND]-(o:User)
      		WHERE u.id = $uId
      		return count(o)
      `,
        ).bind({ uId: from.toString() }),
      ),
    ]);
    return {
      total,
      items,
      current: skip,
      pageSize: items.length,
    };
  }

  async getIngoings({
    interaction,
    from,
    skip,
    limit,
    searchTerm,
    onlyFriends = false,
  }: {
    interaction: FriendInteraction;
    from: UniqueEntityID;
    skip: number;
    limit: number;
    searchTerm: string;
    onlyFriends: boolean;
  }): Promise<PaginatedFindResult<UserInteractor>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<UserInteractor>(
        QuerySpecification.withStatement(
          `MATCH (me:User)
					WHERE me.id = $meId
					MATCH (u:User)-[:FRIEND]-(user:User)
					WHERE user.id = $userId  AND u.id <> me.id ${
            onlyFriends ? 'AND (u)-[:FRIEND]-(me)' : ''
          }
					AND ( toLower(u.username) STARTS WITH toLower($search) OR toLower(u.fullname) CONTAINS toLower($search) )
					OPTIONAL MATCH (u)-[:FRIEND]-(common:User)-[:FRIEND]-(me)
					OPTIONAL MATCH (u)-[rfriend:FRIEND|FRIEND_REQUEST]-(me)
					WITH u, count(common) as commonFriends,rfriend,me
					RETURN {
						username:u.username,
						friendshipStatus: CASE
														WHEN rfriend is null THEN 'none' 
														WHEN toLower(type(rfriend)) = 'friend' THEN 'friend' 
														WHEN startNode(rfriend)=me THEN 'requested'
														ELSE 'friend_request' END,
						id:u.id,
						fullname:u.fullname,
						friendsInCommon:commonFriends,
						avatar:u.avatar,
						email:u.email
					} as result
					ORDER BY result.friendsInCommon DESC
					SKIP $skip
					LIMIT $limit
					`,
        ).bind({
          meId: from.toString(),
          userId: interaction.to.toString(),
          search: searchTerm,
          skip: Integer.fromInt(skip),
          limit: Integer.fromInt(limit),
        }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (me:User) WHERE me.id = $meId
					MATCH (u:User)-[:FRIEND]->(user:User)
					WHERE user.id = $userId AND u.id <> me.id ${
            onlyFriends ? 'AND (u)-[:FRIEND]-(me)' : ''
          }
					AND ( toLower(u.username) STARTS WITH toLower($search) OR toLower(u.fullname) CONTAINS toLower($search) )
					RETURN count(u)
					`,
        ).bind({
          search: searchTerm,
          userId: interaction.to.toString(),
          meId: from.toString(),
        }),
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
    interaction: FriendInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[req:FRIEND_REQUEST]-(f:User)
				WHERE u.id = $uId AND f.id = $fId
				DELETE req
				MERGE (u)-[r:FRIEND]->(f)
				SET r.createdAt = datetime()`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: FriendInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:FRIEND]->(f:User)
				WHERE u.id = $uId AND f.id = $fId
				DELETE r
				`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async isPosible(
    interaction: FriendInteraction,
    from: SocialGraphNode,
  ): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:User)-[:FRIEND_REQUEST]->(sender:User)
				WHERE n.id = $fId AND sender.id = $senderId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ fId: interaction.to.toString(), senderId: from.toString() }),
    );
  }
}
