import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import { EventDetails } from './events/presentation/event-details';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';

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
    const items = await this.persistenceManager.query<EventDetails>(
      QuerySpecification.withStatement(
        `
				MATCH (p:Publication)
				WHERE p.dateTimeEnd > datetime()
				CALL apoc.when(p:Event,'
					MATCH (pl:Place)<-[:HAS_PLACE]-(item)<-[:PUBLISH_EVENT]-(p:Partner),
					(item)-[:HAS_CATEGORY]->(cat:Category),
					(item)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
					OPTIONAL MATCH (item)-[:HAS_TAG]-(tag:AttentionTag)
					OPTIONAL MATCH (item)<-[:COLLABORATOR]-(c:Partner)
					MATCH (me:User)
					WHERE me.id = $meId
					OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
					OPTIONAL MATCH (me)-[rlike:LIKE]-(item)
					OPTIONAL MATCH (u:User)-[:LIKE]->(item)
					WITH {
						id:o.id,
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						tickets:collect(distinct t { .id, .price, .name, .amount, .description})
					} as occ, item as e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me
					with distinct {
						type:"event",
						id:e.id,
						name:e.name,
						occurrences:collect(occ),
						info:e.description,
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
						basePrice:e.basePrice
					} as eventInfo, me, e
					call {
						WITH e,me
						OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
						RETURN f LIMIT 3
          }
					return apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})}) as result
				','
					MATCH (item)--(e:Event)
					,(pl:Place)<-[:HAS_PLACE]-(e)<-[:PUBLISH_EVENT]-(p:Partner),
					(e)-[:HAS_CATEGORY]->(cat:Category),
					(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
					OPTIONAL MATCH (e)<-[:COLLABORATOR]-(c:Partner)
					MATCH (me:User)
					WHERE me.id = $meId
					OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
					OPTIONAL MATCH (me)-[rlike:LIKE]-(e)
					OPTIONAL MATCH (u:User)-[:LIKE]->(e)
					WITH {
						id:o.id,
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						tickets:collect(distinct t { .id, .price, .name, .amount, .description})
					} as occ, e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me,item
					with distinct {
						id:e.id,
						name:e.name,
						occurrences:collect(occ),
						info:e.description,
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
						basePrice:e.basePrice
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
						events:collect(events)
					} as result
				',{item:p,meId:$meId}) YIELD value
				return value.result as r
				ORDER BY r.id
				SKIP $skip
				LIMIT $limit
			`,
      )
        .bind({
          limit: Integer.fromInt(limit),
          skip: Integer.fromInt(skip),
          meId: userId,
        })
        .map((r) => {
          return r.type === 'event'
            ? {
                ...r,
                info: TextUtils.escapeAndParse(r.info),
                multimedia: TextUtils.escapeAndParse(r.multimedia),
                dateTimeInit: parseDate(r.dateTimeInit),
                dateTimeEnd: parseDate(r.dateTimeEnd),
                occurrences: r.occurrences.map((o) => {
                  return {
                    ...o,
                    dateTimeInit: parseDate(o.dateTimeInit),
                    dateTimeEnd: parseDate(o.dateTimeEnd),
                  };
                }),
              }
            : {
                ...r,
                events: r.events.map((e) => {
                  return {
                    ...e,
                    info: TextUtils.escapeAndParse(e.info),
                    multimedia: TextUtils.escapeAndParse(e.multimedia),
                    occurrences: e.occurrences.map((o) => {
                      return {
                        ...o,
                        dateTimeInit: parseDate(o.dateTimeInit),
                        dateTimeEnd: parseDate(o.dateTimeEnd),
                      };
                    }),
                  };
                }),
              };
        }),
    );
    return {
      items: items,
      total: 27,
      current: skip,
      pageSize: items.length,
    };
  }
}
