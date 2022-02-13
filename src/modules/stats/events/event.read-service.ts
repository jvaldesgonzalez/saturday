import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { EventDetailsReadEntity } from './entities/event-details.entity';
import { EventListItemReadEntity } from './entities/event-list-item.entity';
import { IEventStats } from './interfaces/event-stats.read-service.interface';
import { EventDetailsMapper } from './mappers/event-details.mapper';
import { EventListItemMapper } from './mappers/event-list-item.mapper';

@Injectable()
export class EventsReadService implements IEventStats {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getEventStatsDetails(
    theEventId: string,
    thePartnerId: string,
  ): Promise<EventDetailsReadEntity> {
    return await this.persistenceManager.getOne<EventDetailsReadEntity>(
      QuerySpecification.withStatement(
        `MATCH (e:Event)-[:PUBLISH_EVENT]-(publisher:Partner),
					(c:Category)--(e)-[:HAS_PLACE]->(p:Place),
					(t:Ticket)--(o:EventOccurrence)--(e)
				WHERE publisher.id = $pId AND e.id = $eId
				WITH distinct e,c,p,collect(o.dateTimeInit) as occurrences, collect(t) as tickets
				RETURN distinct {
						tickets:{
							price:[e.basePrice,e.topPrice],
							sold:50,
							total:100
						},
						event: e{
							.name,
							.multimedia,
							.id,
							.description,
							place:p{.name, .address, .latitude, .longitude},
							category:c.name,
							occurrencesDate: occurrences
						}
					}
				`,
      )
        .bind({ eId: theEventId, pId: thePartnerId })
        .map((a) => {
          console.log(a);
          return EventDetailsMapper.toDto(a);
        }),
    );
  }

  async getEventStatsListByPartner(
    thePartnerId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventListItemReadEntity>> {
    const items = await this.persistenceManager.query<EventListItemReadEntity>(
      QuerySpecification.withStatement(
        `MATCH (p:Partner)-[:PUBLISH_EVENT]->(e:Event),
				(place:Place)--(e)--(c:Category)
				WHERE p.id = $pId
				OPTIONAL MATCH (e)-[:LIKE]-(liked:User)
				OPTIONAL MATCH (e)--(:ForwardedEvent)-[:FORWARD]-(forwarded:User)
				RETURN e{
					.id,
					.name,
					.dateTimeInit,
					.multimedia,
					.createdAt,
					place:place.name,
					category:c.name,
					stats:{
						reached:100,
						interested:count(distinct liked),
						sharedTimes:count(distinct forwarded)
					}
				}
					ORDER BY e.createdAt DESC
				`,
      )
        .bind({ pId: thePartnerId })
        .skip(skip)
        .limit(limit)
        .map(EventListItemMapper.toDto)
        .transform(EventListItemReadEntity),
    );
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `MATCH (p:Partner)-[:PUBLISH_EVENT]->(e:Event)
				WHERE p.id = $pId
				RETURN count(e)
				`,
      ).bind({ pId: thePartnerId }),
    );
    return {
      total,
      items,
      pageSize: items.length,
      current: skip,
    };
  }
}
