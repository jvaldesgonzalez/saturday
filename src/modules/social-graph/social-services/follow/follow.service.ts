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
import { UserInteractor } from '../../common/user.interactor';
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
    const [items, total] = await Promise.all([
      this.persistenceManager.query<Followee>(
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
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `MATCH (u:User)-[:FOLLOW]->(p:Partner)
					WHERE u.id = $uId
				return count(p)
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

  async getOutgoingsFromRemoteNode(
    from: UniqueEntityID,
    skip: number,
    limit: number,
    searchTerm = '',
    me: UniqueEntityID,
    onlyFollowees = false,
  ): Promise<PaginatedFindResult<Followee>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<Followee>(
        QuerySpecification.withStatement(
          `MATCH (me:User)
					WHERE me.id = $meId
					MATCH (u:User)-[r:FOLLOW]->(p:Partner)
					WHERE u.id = $uId AND (p.username STARTS WITH $search OR p.businessName STARTS WITH $search) ${
            onlyFollowees ? 'AND (me)-[:FOLLOW]-(p)' : ''
          }

				OPTIONAL MATCH (p)<-[:FOLLOW]-(o:User)

				RETURN distinct {
					id:p.id,
					username:p.username,
					email:p.email,
					avatar:p.avatar,
					businessName:p.businessName,
					amountOfFollowers: count(distinct o)
					}
					SKIP $skip
					LIMIT $limit
				`,
        ).bind({
          uId: from.toString(),
          meId: me.toString(),
          search: searchTerm,
          skip: Integer.fromInt(skip),
          limit: Integer.fromInt(limit),
        }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `MATCH (me:User) WHERE me.id = $meId
					MATCH (u:User)-[:FOLLOW]->(p:Partner)
					WHERE u.id = $uId AND (p.username STARTS WITH $search OR p.businessName STARTS WITH $search) ${
            onlyFollowees ? 'AND (me)-[:FOLLOW]-(p)' : ''
          }
					RETURN count(p)
				`,
        ).bind({
          uId: from.toString(),
          meId: me.toString(),
          search: searchTerm,
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

  async getIngoings({
    interaction,
    from,
    skip,
    limit,
    searchTerm,
    onlyFriends = false,
  }: {
    interaction: FollowInteraction;
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
					MATCH (u:User)-[:FOLLOW]->(p:Partner)
					WHERE p.id = $pId  AND u.id <> me.id ${
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
          pId: interaction.to.toString(),
          search: searchTerm,
          skip: Integer.fromInt(skip),
          limit: Integer.fromInt(limit),
        }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (me:User) WHERE me.id = $meId
					MATCH (u:User)-[:FOLLOW]->(p:Partner)
					WHERE p.id = $pId AND u.id <> me.id ${
            onlyFriends ? 'AND (u)-[:FRIEND]-(me)' : ''
          }
					AND ( toLower(u.username) STARTS WITH toLower($search) OR toLower(u.fullname) CONTAINS toLower($search) )
					RETURN count(u)
					`,
        ).bind({
          search: searchTerm,
          pId: interaction.to.toString(),
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
    interaction: FollowInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(p:Partner)
				WHERE u.id = $uId AND p.id = $pId
				MERGE (u)-[r:FOLLOW]->(p)
				SET r.createdAt = datetime()`,
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
