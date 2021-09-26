import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import { EventDetails } from 'src/modules/publications/events/presentation/event-details';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { UserInteractor } from '../../common/user.interactor';
import { LikeInteraction } from './like.interaction';

@Injectable()
export class LikeService
  implements ISocialGraphService<EventDetails, LikeInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getOutgoings(
    from: UniqueEntityID,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventDetails>(
        QuerySpecification.withStatement(
          `
					MATCH (me:User)
					WHERE me.id = $meId

					MATCH (pl:Place)<-[:HAS_PLACE]-(e:Event)<-[:PUBLISH_EVENT]-(p:Partner),
					(me)-[like:LIKE]->(e),
					(e)-[:HAS_CATEGORY]->(cat:Category),
					(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
					OPTIONAL MATCH (e)<-[:COLLABORATOR]-(c:Partner)

					OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
					OPTIONAL MATCH (u:User)-[:LIKE]->(e)

					WITH {
						id:o.id,
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						tickets:collect(t { .id, .price, .name, .amount, .description})
					} as occ, e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rfollow,like.createdAt as likedAt
					with {
						id:e.id,
						name:e.name,
						occurrences:collect(occ),
						info:e.description,
						publisher:{
							id:p.id,
							avatar:p.avatar,
							username:p.username,
							IFollowThis: rfollow IS NOT null
						},
						category:{
							name:cat.name,
							id:cat.id
						},
						place:{
							name:pl.name,
							address:pl.address,
							longitude:apoc.number.parseFloat(pl.longitude),
							latitude:apoc.number.parseFloat(pl.latitude)
						},
						collaborators: coll,
						multimedia:e.multimedia,
						attentionTags: tags,
						amIInterested:true,
						totalUsersInterested:usersInterested
					} as events,likedAt
					ORDER BY likedAt DESC
					SKIP $skip
					LIMIT $limit
					RETURN events
				`,
        )
          .bind({
            meId: from.toString(),
            limit: Integer.fromInt(limit),
            skip: Integer.fromInt(skip),
          })
          .map((r) => {
            return {
              ...r,
              info: JSON.parse(r.info),
              multimedia: JSON.parse(r.multimedia),
              occurrences: r.occurrences.map((o) => {
                return {
                  ...o,
                  dateTimeInit: parseDate(o.dateTimeInit),
                  dateTimeEnd: parseDate(o.dateTimeEnd),
                };
              }),
            };
          }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
				MATCH (u:User)-[like:LIKE]->(e:Event)
				WHERE u.id = $uId
				return count(e)
				`,
        ).bind({ uId: '777cc88c-2e3f-4eb4-ac81-14c9323c541d' }),
      ),
    ]);
    return {
      items,
      pageSize: items.length,
      current: skip,
      total,
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
    interaction: LikeInteraction;
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
					MATCH (u:User)-[:LIKE]->(e:Event)
					WHERE e.id = $eId  AND u.id <> me.id ${
            onlyFriends ? 'AND (u)-[:FRIEND]-(me)' : ''
          }
					AND ( toLower(u.username) STARTS WITH toLower($search) OR toLower(u.fullname) CONTAINS toLower($search) )
					OPTIONAL MATCH (u)-[:FRIEND]-(common:User)-[:FRIEND]-(me)
					OPTIONAL MATCH (u)-[r]-(me)
					WITH u, count(common) as commonFriends,r
					RETURN {
						username:u.username,
						friendshipStatus:CASE WHEN r is null THEN "none" ELSE toLower(type(r)) END,
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
          eId: interaction.to.toString(),
          search: searchTerm,
          skip: Integer.fromInt(skip),
          limit: Integer.fromInt(limit),
        }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (me:User) WHERE me.id = $meId
					MATCH (u:User)-[:LIKE]->(e:Event)
					WHERE e.id = $eId AND u.id <> me.id ${
            onlyFriends ? 'AND (u)-[:FRIEND]-(me)' : ''
          }
					AND ( toLower(u.username) STARTS WITH toLower($search) OR toLower(u.fullname) CONTAINS toLower($search) )
					RETURN count(u)
					`,
        ).bind({
          search: searchTerm,
          eId: interaction.to.toString(),
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
    interaction: LikeInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(e:Event)
				WHERE u.id = $uId AND e.id = $eId
				MERGE (u)-[:LIKE {likedAt: datetime()}]->(e)`,
      ).bind({ uId: from.toString(), eId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: LikeInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:LIKE]->(e:Event)
				WHERE u.id = $uId AND e.id = $eId
				DELETE r
				`,
      ).bind({ uId: from.toString(), eId: interaction.to.toString() }),
    );
  }

  async isPosible(interaction: LikeInteraction): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:Event)
				WHERE n.id = $eId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ eId: interaction.to.toString() }),
    );
  }
}
