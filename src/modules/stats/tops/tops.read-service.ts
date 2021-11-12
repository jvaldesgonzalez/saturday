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
					MATCH (publisher:Partner)--(e:Event)--(place:Place)
					RETURN {
						publisher:publisher{.avatar, .id, .username},
						name:e.name,
						multimedia:e.multimedia,
						place:place{.name, .address, .latitude, .longitude},
						dateTimeInit:e.dateTimeInit,
						dateTimeEnd:e.dateTimeEnd,
						id:e.id,
						basePrice:e.basePrice
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
					RETURN count(e)
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
					(e)-[:HAS_OCCURRENCE]-(o:EventOccurrence)-[:HAS_TICKET]-(t:Ticket)--(p:Purchase),
					(e)-[:HAS_CATEGORY]->(cat:Category)
					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
					WITH o{.id, .dateTimeInit, .dateTimeEnd} as occ,
						e,
						place{.name, .latitude, .longitude} as place,
						publisher{.id, .avatar, .username} as publisher,
						count(p) as purchases,
						collect(distinct cat{.id, .name})
					WHERE purchases > 0
					RETURN {
						publisher:publisher{.avatar, .id, .username},
						name:e.name,
						multimedia:e.multimedia,
						place:place{.name, .address},
						dateTimeInit:e.dateTimeInit,
						dateTimeEnd:e.dateTimeEnd,
						id:e.id,
						basePrice:e.basePrice
					}
					ORDER BY purchases DESC
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
					MATCH (e:Event)--(o:EventOccurrence)--(t:Ticket)--(p:Purchase)
					WITH e, count(p) as purchases
					WHERE purchases > 0
					RETURN count(e)
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
