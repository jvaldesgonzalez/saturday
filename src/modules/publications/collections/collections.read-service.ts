import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { EventDetails } from '../events/presentation/event-details';
import { CollectionDetails } from './presentation/collection-details';

@Injectable()
export class CollectionsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getCollectionDetails(collectionId: string): Promise<CollectionDetails> {
    return (
      (await this.persistenceManager.maybeGetOne<CollectionDetails>(
        QuerySpecification.withStatement(
          `
				MATCH (col:Collection)--(e:Event),
				(pl:Place)<-[:HAS_PLACE]-(e:Event)<-[:PUBLISH_EVENT]-(p:Partner),
				(e)-[:HAS_CATEGORY]->(cat:Category),
				(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
				WHERE col.id = $cId
				OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag),
				(e)<-[:COLLABORATOR]-(c:Partner)
				WITH {
					id:o.id,
					dateTimeInit:o.dateTimeInit,
					dateTimeEnd:o.dateTimeEnd,
					tickets:collect(t { .id, .price, .name, .amount, .description})
				} as occ, e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,col
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
				} AS events,col
				return {
					name:col.name,
					description:col.description,
					events:collect(events)
				}
				`,
        )
          .bind({ cId: collectionId })
          .map((r) => {
            console.log(r);
            return {
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
          })
          .transform(EventDetails),
      )) ?? null
    );
  }
}