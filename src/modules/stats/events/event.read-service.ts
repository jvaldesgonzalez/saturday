import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { EventListItemReadEntity } from './entities/event-list-item.entity';
import { IEventStats } from './interfaces/event-stats.read-service.interface';
import { EventListItemMapper } from './mappers/event-list-item.mapper';

@Injectable()
export class EventsReadService implements IEventStats {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getEventStatsListByPartner(
    thePartnerId: string,
    skip: number,
    limit: number,
  ): Promise<EventListItemReadEntity[]> {
    return await this.persistenceManager.query<EventListItemReadEntity>(
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
  }
}
