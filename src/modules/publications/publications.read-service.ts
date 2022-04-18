import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { EventDetails } from './events/presentation/event-details';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { EventDetailsReadMapper } from './events/read-model/mappers/event-details.read-mapper';

@Injectable()
export class PublicationsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getHome(
    limit: number,
    skip: number,
    userId: string,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventDetails>(
        QuerySpecification.withStatement(
          `
				MATCH (p:Publication)
				WHERE (p:Event AND p.dateTimeEnd > datetime())
				OR (p:Collection 
					AND size([(p)--(e:Event) WHERE e.dateTimeEnd > datetime()|e ]) > 2
					)
				OR (size([(:User {id:$meId})-[:PREFER_CATEGORY]->(c:Category)-[:HAS_EMBEDDED_COLLECTION]->(p)-[:PREFER_CATEGORY]-(c)-[:HAS_CATEGORY]-(e:Event) WHERE e.dateTimeEnd > datetime() | e]) > 2
					)
				CALL apoc.case([
					p:Event,
						'MATCH (pl:Place)<-[:HAS_PLACE]-(item)<-[:PUBLISH_EVENT]-(p:Partner),
						(item)-[:HAS_CATEGORY]->(cat:Category)
						OPTIONAL MATCH (item)-[:HAS_TAG]-(tag:AttentionTag)
						OPTIONAL MATCH (item)<-[:COLLABORATOR]-(c:Partner)
						MATCH (me:User)
						WHERE me.id = $meId
						OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
						OPTIONAL MATCH (me)-[rlike:LIKE]-(item)
						OPTIONAL MATCH (u:User)-[:LIKE]->(item)
						OPTIONAL MATCH (me:User)-[rPrediction:LIKE_PREDICTION]->(item)

						WITH item as e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me,rPrediction
						with distinct {
							type:"event",
							id:e.id,
							name:e.name,
							occurrences:[],
							info:e.description,
							likePrediction: CASE WHEN rPrediction IS NULL THEN 0 ELSE rPrediction.score END,
							publisher:{
								id:p.id,
								avatar:p.avatar,
								username:p.username,
								businessName:p.businessName,
								IFollowThis: rfollow IS NOT null
							},
							category:{
								name:cat.name,
								id:cat.id
							},
							place:{
								name:pl.name,
								address:pl.address,
								longitude:pl.longitude,
								latitude:pl.latitude
							},
							collaborators: coll,
							multimedia:e.multimedia,
							attentionTags: tags,
							amIInterested: rlike IS NOT null,
							totalUsersInterested: usersInterested,
							dateTimeInit:e.dateTimeInit,
							dateTimeEnd:e.dateTimeEnd,
							createdAt:e.createdAt,
							basePrice:e.basePrice,
							slug:e.slug
						} as eventInfo, me, e
						call {
							WITH e,me
							OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
							RETURN f LIMIT 3
						}
						return apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})}) as result',
					p:Collection,
						'MATCH (item)--(e:Event)
						,(pl:Place)<-[:HAS_PLACE]-(e)<-[:PUBLISH_EVENT]-(p:Partner),
						(e)-[:HAS_CATEGORY]->(cat:Category)
						OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
						OPTIONAL MATCH (e)<-[:COLLABORATOR]-(c:Partner)
						MATCH (me:User)
						WHERE me.id = $meId
						OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
						OPTIONAL MATCH (me)-[rlike:LIKE]-(e)
						OPTIONAL MATCH (u:User)-[:LIKE]->(e)
						OPTIONAL MATCH (me:User)-[rPrediction:LIKE_PREDICTION]->(e)
						WITH e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me,item,rPrediction
						with distinct {
							id:e.id,
							name:e.name,
							occurrences:[],
							info:e.description,
							likePrediction: CASE WHEN rPrediction IS NULL THEN 0 ELSE rPrediction.score END,
							publisher:{
								id:p.id,
								avatar:p.avatar,
								username:p.username,
								businessName:p.businessName,
								IFollowThis: rfollow IS NOT null
							},
							category:{
								name:cat.name,
								id:cat.id
							},
							place:{
								name:pl.name,
								address:pl.address,
								longitude:(pl.longitude),
								latitude:(pl.latitude)
							},
							collaborators: coll,
							multimedia:e.multimedia,
							attentionTags: tags,
							amIInterested: rlike IS NOT null,
							totalUsersInterested: usersInterested,
							dateTimeInit:e.dateTimeInit,
							dateTimeEnd:e.dateTimeEnd,
							basePrice:e.basePrice,
							slug:e.slug
						} as eventInfo, me, e,item
						call {
							WITH e,me
							OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
							RETURN f LIMIT 3
						}
						WITH apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})}) as events,item
						return {
							type:"collection",
							id:item.id,
							name:item.name,
							description:item.description,
							events:collect(events),
							createdAt:item.createdAt,
							likePrediction:apoc.coll.avg(collect(events.likePrediction))
						} as result',
					p:EmbeddedCollection,
						'MATCH (item)--(cat:Category)--(e:Event)
						,(pl:Place)<-[:HAS_PLACE]-(e)<-[:PUBLISH_EVENT]-(p:Partner)
						WHERE e.dateTimeEnd > datetime()
						OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
						OPTIONAL MATCH (e)<-[:COLLABORATOR]-(c:Partner)
						MATCH (me:User)
						WHERE me.id = $meId
						OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
						OPTIONAL MATCH (me)-[rlike:LIKE]-(e)
						OPTIONAL MATCH (u:User)-[:LIKE]->(e)
						OPTIONAL MATCH (me:User)-[rPrediction:LIKE_PREDICTION]->(e)
						WITH e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me,item,rPrediction
						with distinct {
							id:e.id,
							name:e.name,
							occurrences:[],
							info:e.description,
							likePrediction: CASE WHEN rPrediction IS NULL THEN 0 ELSE rPrediction.score END,
							publisher:{
								id:p.id,
								avatar:p.avatar,
								username:p.username,
								businessName:p.businessName,
								IFollowThis: rfollow IS NOT null
							},
							category:{
								name:cat.name,
								id:cat.id
							},
							place:{
								name:pl.name,
								address:pl.address,
								longitude:(pl.longitude),
								latitude:(pl.latitude)
							},
							collaborators: coll,
							multimedia:e.multimedia,
							attentionTags: tags,
							amIInterested: rlike IS NOT null,
							totalUsersInterested: usersInterested,
							dateTimeInit:e.dateTimeInit,
							dateTimeEnd:e.dateTimeEnd,
							basePrice:e.basePrice,
							slug:e.slug
						} as eventInfo, me, e,item
						call {
							WITH e,me
							OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
							RETURN f LIMIT 3
						}
						WITH apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})}) as events,item
						return {
							type:"collection",
							id:item.id,
							name:item.name,
							description:item.description,
							events:collect(events),
							isMini:true,
							likePrediction:apoc.coll.avg(collect(events.likePrediction))
							createdAt:item.createdAt
						} as result'
				],
				'return null as result',
				{item:p,meId:$meId}) YIELD value
				return value.result as r
				ORDER BY r.likePrediction DESC
			`,
        )
          .bind({
            meId: userId,
          })
          .skip(skip)
          .limit(limit)
          .map((r) => {
            delete r.createdAt;
            if (r.type === 'collection') console.log(r.name);
            return r.type === 'event'
              ? EventDetailsReadMapper.toResponse(r)
              : {
                  ...r,
                  events: r.events.map(EventDetailsReadMapper.toResponse),
                };
          }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (p:Publication)
					WHERE (p:Event AND p.dateTimeEnd > datetime())
					OR (p:Collection AND apoc.coll.max( [ (p)--(e:Event) | e.dateTimeEnd ] )> datetime() AND size( [ (p)--(e:Event) | e ] ) > 2)
					OR (
						p:EmbeddedCollection 
						AND (:User {id:$meId})-[:PREFER_CATEGORY]->(:Category)-[:HAS_EMBEDDED_COLLECTION]->(p)
						AND (apoc.coll.max( [ (p)--(:Category)--(e:Event) | e.dateTimeEnd ] ) > datetime()) 
						AND (size( [ (p)--(:Category)--(e:Event) WHERE e.dateTimeEnd > datetime() | e ] ) > 2)
					)
					RETURN count(p)
					`,
        ).bind({ meId: userId }),
      ),
    ]);
    return {
      items: items,
      total,
      current: skip,
      pageSize: items.length,
    };
  }
}
