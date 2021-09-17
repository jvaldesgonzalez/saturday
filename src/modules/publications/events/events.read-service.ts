import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { EventDetails } from './presentation/event-details';

@Injectable()
export class EventsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getEventDetails(eventId: string): Promise<EventDetails> {
    return (
      (await this.persistenceManager.maybeGetOne<EventDetails>(
        QuerySpecification.withStatement(
          `
				MATCH (pl:Place)<-[:HAS_PLACE]-(e:Event)<-[:PUBLISH_EVENT]-(p:Partner),
				(e)-[:HAS_CATEGORY]->(cat:Category),
				(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
				WHERE e.id = $eId
				OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag),
				(e)<-[:COLLABORATOR]-(c:Partner)
				WITH {
					id:o.id,
					dateTimeInit:o.dateTimeInit,
					dateTimeEnd:o.dateTimeEnd,
					tickets:collect(t { .id, .price, .name, .amount, .description})
				} as occ, e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll
				return {
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
				}
				`,
        )
          .bind({ eId: eventId })
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
          })
          .transform(EventDetails),
      )) ?? null
    );
  }

  async getEventsLikedByUser(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const items = await this.persistenceManager.query<EventDetails>(
      QuerySpecification.withStatement(
        `
					MATCH (pl:Place)<-[:HAS_PLACE]-(e:Event)<-[:PUBLISH_EVENT]-(p:Partner),
					(u:User)-[like:LIKE]->(e),
					(e)-[:HAS_CATEGORY]->(cat:Category),
					(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
					WHERE u.id = $uId
					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag),
					(e)<-[:COLLABORATOR]-(c:Partner)
					WITH {
						id:o.id,
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						tickets:collect(t { .id, .price, .name, .amount, .description})
					} as occ, e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,like
					with {
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
						amIInterested:true,
						totalUserInterested:34
					} as events,like
					ORDER BY like.likedAt
					SKIP $skip
					LIMIT $limit
					RETURN events
				`,
      )
        .bind({
          uId: '8de83b51-04aa-42d8-861e-4289160694ef',
          limit: Integer.fromInt(limit),
          skip: Integer.fromInt(skip),
        })
        .map((r) => {
          console.log(r);
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
    );
    return {
      items,
      pageSize: limit,
      current: skip,
      total: 5,
    };
  }
}
