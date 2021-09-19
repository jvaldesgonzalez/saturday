import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { DateTime, Integer } from 'neo4j-driver-core';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
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
              occurrences: r.occurrences.map(
                (o: {
                  dateTimeInit: DateTime<number>;
                  dateTimeEnd: DateTime<number>;
                }) => {
                  return {
                    ...o,
                    dateTimeInit: parseDate(o.dateTimeInit),
                    dateTimeEnd: parseDate(o.dateTimeEnd),
                  };
                },
              ),
            };
          })
          .transform(EventDetails),
      )) ?? null
    );
  }

  async getEventsWithHashtag(
    hashtagWord: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const sanitizedWord = TextUtils.removeLeadingSharpCharacter(
      hashtagWord.trim(),
    );
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventDetails>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)-[:CONTAIN_HASHTAG]->(h:Hashtag),
					(pl:Place)<-[:HAS_PLACE]-(e)<-[:PUBLISH_EVENT]-(p:Partner),
					(e)-[:HAS_CATEGORY]->(cat:Category),
					(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
					WHERE h.word = $hashtagWord
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
					} as result
					ORDER BY result.createdAt DESC
					SKIP $skip
					LIMIT $limit
					`,
        )
          .bind({
            hashtagWord: sanitizedWord,
            skip: Integer.fromInt(skip),
            limit: Integer.fromInt(limit),
          })
          .map((r) => {
            return {
              ...r,
              info: JSON.parse(r.info),
              multimedia: JSON.parse(r.multimedia),
              occurrences: r.occurrences.map(
                (o: {
                  dateTimeInit: DateTime<number>;
                  dateTimeEnd: DateTime<number>;
                }) => {
                  return {
                    ...o,
                    dateTimeInit: parseDate(o.dateTimeInit),
                    dateTimeEnd: parseDate(o.dateTimeEnd),
                  };
                },
              ),
            };
          })
          .transform(EventDetails),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)-[:CONTAIN_HASHTAG]->(h:Hashtag)
					WHERE h.word = $hashtagWord
					`,
        ).bind({ hashtagWord: sanitizedWord }),
      ),
    ]);
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
}
