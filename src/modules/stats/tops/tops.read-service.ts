import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { EventReadEntity } from './entities/event.entity';
import { ITopsService } from './interfaces/tops.read-service.interface';
import { TopsEventMapper } from './mappers/event.mapper';

@Injectable()
export class TopsReadService implements ITopsService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async getTopCheap(
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventReadEntity>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventReadEntity>(
        QuerySpecification.withStatement(
          `
					MATCH (publisher:Partner)-[:PUBLISH_EVENT]-(e:Event)-[:HAS_PLACE]-(place:Place),
					(e)-[:HAS_OCCURRENCE]-(o:EventOccurrence)-[:HAS_TICKET]-(t:Ticket),
					(e)-[:HAS_CATEGORY]->(cat:Category)
					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
					WITH o{.id, .dateTimeInit, .dateTimeEnd, tickets:collect(distinct t{.id, .price, .name, .amount, .description})} as occ,
						e,
						place{.name, .latitude, .longitude, .address} as place,
						publisher{.id, .avatar, .username} as publisher,
						cat{.id, .name} as cat,
						collect(distinct tag{.title, .color, .description}) as tags
					RETURN distinct {
						publisher:publisher,
						name:e.name,
						multimedia:e.multimedia,
						place:place,
						dateTimeInit:e.dateTimeInit,
						dateTimeEnd:e.dateTimeEnd,
						id:e.id,
						info: e.description,
						basePrice:e.basePrice,
						category:cat,
						place:place,
						attentionTags: tags
					} as event
					ORDER BY event.basePrice
				`,
        )
          .skip(skip)
          .limit(limit)
          .map(TopsEventMapper.toDto)
          .transform(EventReadEntity),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)
					RETURN count(distinct e)
					`,
        ),
      ),
    ]);
    return {
      total,
      items,
      current: skip,
      pageSize: items.length,
    };
  }

  async getTopSellers(
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventReadEntity>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventReadEntity>(
        QuerySpecification.withStatement(
          `
					MATCH (publisher:Partner)-[:PUBLISH_EVENT]-(e:Event)-[:HAS_PLACE]-(place:Place),
					(e)-[:HAS_OCCURRENCE]-(o:EventOccurrence)-[:HAS_TICKET]-(t:Ticket)--(p:Reservation),
					(e)-[:HAS_CATEGORY]->(cat:Category)
					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
					WITH o{.id, .dateTimeInit, .dateTimeEnd, tickets:collect(distinct t{.id, .price, .name, .amount, .description})} as occ,
						place{.name, .latitude, .longitude, .address} as place,
						publisher{.id, .avatar, .username} as publisher,
						count(p) as purchases,
						cat{.id, .name} as cat,
						collect(distinct tag{.title, .color, .description}) as tags,
						e
					RETURN distinct{
						publisher:publisher,
						name:e.name,
						multimedia:e.multimedia,
						place:place,
						dateTimeInit:e.dateTimeInit,
						dateTimeEnd:e.dateTimeEnd,
						id:e.id,
						info: e.description,
						basePrice:e.basePrice,
						category:cat,
						place:place,
						attentionTags: tags,
						purchases:purchases
					} as events
					ORDER BY events.purchases DESC
				`,
        )
          .skip(skip)
          .limit(limit)
          .map(TopsEventMapper.toDto)
          .transform(EventReadEntity),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)--(o:EventOccurrence)--(t:Ticket)--(p:Reservation)
					WITH e, count(p) as purchases
					WHERE purchases > 0
					RETURN count(distinct e)
					`,
        ),
      ),
    ]);
    return {
      total,
      items,
      current: skip,
      pageSize: items.length,
    };
  }
}
