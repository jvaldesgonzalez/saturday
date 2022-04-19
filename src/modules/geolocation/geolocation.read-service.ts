import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { makeDate } from 'src/shared/modules/data-access/neo4j/utils';
import { MapLocation } from 'src/shared/typedefs/map-location';
import { EventWithPlaceEntity } from './entities/place-with-event.entity';
import { EventWithPlaceMapper } from './mappers/event-with-place.mapper';

@Injectable()
export class GeolocationReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getNearEvents(
    location: MapLocation,
    radius: number,
    dateInterval?: { from: Date; to: Date },
    categories: string[] = [],
    priceInterval?: { from: number; to: number },
  ): Promise<EventWithPlaceEntity[]> {
    console.log({ priceInterval });
    return await this.persistenceManager.query<EventWithPlaceEntity>(
      QuerySpecification.withStatement(
        `
				WITH point({latitude:$latitude, longitude:$longitude}) as center
				MATCH (publisher:Partner)-[:PUBLISH_EVENT]-(e:Event)--(place:Place),
				(c:Category)--(e:Event)
				WHERE e.dateTimeEnd >= $now
				${
          dateInterval
            ? 'AND e.dateTimeInit >= $fromDate AND e.dateTimeEnd <= $toDate'
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
				${
          priceInterval
            ? 'AND e.basePrice >= $fromPrice AND e.topPrice <= $toPrice'
            : ''
        } 
				OPTIONAL MATCH (hostPartner:Partner)-[:HAS_PLACE]-(place)
				WITH {
					publisher: publisher{.id, .avatar, .username},
					dateTimeInit:e.dateTimeInit,
					dateTimeEnd:e.dateTimeEnd,
					name:e.name,
					id:e.id,
					place: place{
						.name,
						.address, 
						.latitude, 
						.longitude,
						partnerRef: hostPartner{.username, .id, .avatar}
					},
					multimedia:e.multimedia
				} as eventWithPlace, distance(center, point(place{.latitude, .longitude})) AS distance
				WHERE distance <= $radius
				RETURN eventWithPlace
				ORDER BY distance
				`,
      )
        .bind({
          latitude: location.latitude,
          longitude: location.longitude,
          radius,
          fromDate: dateInterval ? makeDate(dateInterval.from) : null,
          toDate: dateInterval ? makeDate(dateInterval.to) : null,
          fromPrice: priceInterval ? priceInterval.from : null,
          toPrice: priceInterval ? priceInterval.to : null,
          categories,
          now: makeDate(new Date()),
        })
        .map(EventWithPlaceMapper.toDto),
    );
  }
}
