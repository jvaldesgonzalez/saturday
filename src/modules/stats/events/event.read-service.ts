import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Gender } from 'src/modules/accounts-management/users/domain/value-objects/gender.value';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { EventDetailsReadEntity } from './entities/event-details.entity';
import { EventListItemReadEntity } from './entities/event-list-item.entity';
import { EventWithOccurrenceDetailsReadEntity } from './entities/event-occurrence-details.entity';
import { IEventStats } from './interfaces/event-stats.read-service.interface';
import { EventDetailsMapper } from './mappers/event-details.mapper';
import { EventListItemMapper } from './mappers/event-list-item.mapper';
import { EventOccurrenceDetailsMapper } from './mappers/event-occurrence-details.mapper';

@Injectable()
export class EventsReadService implements IEventStats {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  private async getEventChart(theEventId: string): Promise<{
    likes: [{ gender: Gender; age: number }];
    shared: [{ gender: Gender; age: number }];
  }> {
    return await this.persistenceManager.getOne<{
      likes: [{ gender: Gender; age: number }];
      shared: [{ gender: Gender; age: number }];
    }>(
      QuerySpecification.withStatement(
        `
					MATCH (e:Event)
					WHERE e.id = $eId
					OPTIONAL MATCH (e)-[:LIKE]-(uLike:User)
					OPTIONAL MATCH (e)--(:ForwardedEvent)-[:FORWARD]-(uForward:User)
					RETURN {
							likes: collect(distinct uLike {
								.gender,
								age: duration.between(uLike.birthday,datetime()).years,
								.username
							}),
							shared: collect(uForward {
								.gender,
								age: duration.between(uForward.birthday,datetime()).years,
								.username
							})
					}
			`,
      )
        .bind({ eId: theEventId })
        .map((r) => {
          return r;
        }),
    );
  }

  private async getEventOccChart(theEventId: string): Promise<
    {
      id: string;
      reservations: [{ gender: Gender; age: number }];
    }[]
  > {
    return await this.persistenceManager.query<{
      id: string;
      reservations: [{ gender: Gender; age: number }];
    }>(
      QuerySpecification.withStatement(
        `
					MATCH (e:Event)--(o:EventOccurrence)--(:Ticket)--(r:Reservation)--(u:User)
					WHERE e.id = $eId
					RETURN {
						id:o.id,
						reservations: collect( u
							{
								.username,
								age: duration.between(u.birthday,datetime()).years,
								.gender
							})
					}
			`,
      )
        .bind({ eId: theEventId })
        .map((r) => {
          console.log(r);
          return r;
        }),
    );
  }

  async getOccurrencesDetails(
    theEventId: string,
    thePartnerId: string,
  ): Promise<EventWithOccurrenceDetailsReadEntity> {
    const charts = await this.getEventOccChart(theEventId);
    const occurrences =
      await this.persistenceManager.getOne<EventWithOccurrenceDetailsReadEntity>(
        QuerySpecification.withStatement(
          `
						MATCH (e:Event)-[:PUBLISH_EVENT]-(p:Partner),
						(t:Ticket)--(o:EventOccurrence)--(e)
						WHERE e.id = $eId AND p.id = $pId
						OPTIONAL MATCH (r:Reservation)--(t:Ticket)
						WITH e,o,t,collect(r.amountOfTickets) as reservationAmounts
						WITH e,o, collect(t{
											.name,
											.price,
											sold:CASE isEmpty(reservationAmounts) 
														WHEN true THEN 0
														ELSE apoc.coll.sum(reservationAmounts) END,
											total:CASE isEmpty(reservationAmounts) 
														WHEN true THEN t.amount
														ELSE apoc.coll.sum(reservationAmounts) + t.amount END
										}) as tickets
						RETURN {
							eventId:e.id,
							eventName:e.name,
							imageUrl:e.multimedia,
							occurrences: collect(o{
								.id,
								.dateTimeInit,
								tickets: tickets
							})
						} AS result ORDER BY result.dateTimeInit
					`,
        )
          .bind({ eId: theEventId, pId: thePartnerId })
          .map((r) => EventOccurrenceDetailsMapper.toDto(r, charts)),
      );

    return occurrences;
  }

  async getEventStatsDetails(
    theEventId: string,
    thePartnerId: string,
  ): Promise<EventDetailsReadEntity> {
    const charts = await this.getEventChart(theEventId);
    return await this.persistenceManager.getOne<EventDetailsReadEntity>(
      QuerySpecification.withStatement(
        `MATCH (e:Event)-[:PUBLISH_EVENT]-(publisher:Partner),
					(c:Category)--(e)-[:HAS_PLACE]->(p:Place),
					(t:Ticket)--(o:EventOccurrence)--(e)
				WHERE publisher.id = $pId AND e.id = $eId
				WITH distinct e,c,p,collect(o.dateTimeInit) as occurrences, collect(t) as tickets
				UNWIND tickets as t
				OPTIONAL MATCH (t)--(r:Reservation)
				WITH e,c,p,occurrences,collect(distinct t) as tickets,apoc.coll.sum(collect(r.amountOfTickets)) as reservationAmounts
				UNWIND tickets as t
				RETURN distinct {
						tickets:{
							price:[e.basePrice,e.topPrice],
							sold:CASE reservationAmounts IS NULL 
										WHEN true THEN 0
										ELSE reservationAmounts END,
							total:CASE reservationAmounts IS NULL 
										WHEN true THEN apoc.coll.sum(collect(t.amount)) 
										ELSE apoc.coll.sum(collect(t.amount)) + reservationAmounts END
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
        .map((r) => EventDetailsMapper.toDto(r, charts)),
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
						reached:NULL,
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
