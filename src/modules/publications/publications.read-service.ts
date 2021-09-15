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

@Injectable()
export class PublicationsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getHome(
    limit: number,
    skip: number,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const items = await this.persistenceManager.query<EventDetails>(
      QuerySpecification.withStatement(
        `
				MATCH (p:Publication)
				CALL apoc.when(p:Event,'
				MATCH (pl:Place)<-[:HAS_PLACE]-(item)<-[:PUBLISH_EVENT]-(p:Partner),
				(item)-[:HAS_CATEGORY]->(cat:Category),
				(item)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
				OPTIONAL MATCH (item)-[:HAS_TAG]-(tag:AttentionTag),
				(item)<-[:COLLABORATOR]-(c:Partner)
				WITH {
					id:o.id,
					dateTimeInit:o.dateTimeInit,
					dateTimeEnd:o.dateTimeEnd,
					tickets:collect(t { .id ,.price, .name, .amount, .description})
				} as occ, item, collect(distinct tag {.title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id, .avatar, .username}) as coll
				return {
					type:"event",
					id:item.id,
					name:item.name,
					occurrences:collect(occ),
					info:item.description,
					publisher:{
						id:p.id,
						avatar:p.avatar,
						username:p.username
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
					multimedia:item.multimedia,
					attentionTags: tags,
					amIInterested:false,
					totalUsersInterested:123
				} as result','
					MATCH (item)--(e:Event),
					(pl:Place)<-[:HAS_PLACE]-(e:Event)<-[:PUBLISH_EVENT]-(p:Partner),
					(e)-[:HAS_CATEGORY]->(cat:Category),
					(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag),
					(e)<-[:COLLABORATOR]-(c:Partner)
					WITH {
						id:o.id,
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						tickets:collect(t { .id, .price, .name, .amount, .description})
					} as occ, e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,item
					WITH {
						id:e.id,
						name:e.name,
						occurrences:collect(occ),
						info:e.description,
						publisher:{
							id:p.id,
							avatar:p.avatar,
							username:p.username
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
						amIInterested:false,
						totalUserInterested:34
					} AS events,item
					return {
     				type:"collection",
						id:item.id,
						name:item.name,
						description:item.description,
						events:collect(events)
					} as result
				',{item:p}) YIELD value
				return value.result as r
				ORDER BY r.id
				SKIP $skip
				LIMIT $limit
			`,
      )
        .bind({ limit: Integer.fromInt(limit), skip: Integer.fromInt(skip) })
        .map((r) => {
          return r.type === 'event'
            ? {
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
              }
            : {
                ...r,
                events: r.events.map((e) => {
                  return {
                    ...e,
                    info: JSON.parse(e.info),
                    multimedia: JSON.parse(e.multimedia),
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
      total: 20,
      current: skip,
      pageSize: limit,
    };
  }
}
