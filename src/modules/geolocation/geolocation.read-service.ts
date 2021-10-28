import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'neo4j-driver-core';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { MapLocation } from 'src/shared/typedefs/map-location';
import { TextUtils } from 'src/shared/utils/text.utils';
import { PlaceWithEvent } from './entities/place-with-event.entity';

@Injectable()
export class GeolocationReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getNearEvents(
    location: MapLocation,
    radius: number,
    dateInterval: { from: Date; to: Date },
    categories: string[] = [],
  ): Promise<PlaceWithEvent[]> {
    console.log(dateInterval);
    return await this.persistenceManager.query<PlaceWithEvent>(
      QuerySpecification.withStatement(
        `
				WITH point({latitude:$latitude, longitude:$longitude}) as center
				MATCH (o:EventOccurrence)--(e:Event)--(place:Place),
				(c:Category)--(e)--(p:Partner)
				WHERE o.dateTimeInit >= $fromDate AND o.dateTimeEnd <= $toDate ${
          categories.some((i) => i) ? 'AND c.id IN $categories' : ''
        }
				WITH {
					publisher: p{.id, .avatar, .username},
					dateTimeInit:o.dateTimeInit,
					dateTimeEnd:o.dateTimeEnd,
					name:e.name,
					id:e.id,
					multimedia:e.multimedia,
					categories:collect(distinct c{.name, .id})
				} as eventInPlace, place, distance(center, point(place{.latitude, .longitude})) AS distance
				WHERE distance <= $radius
				RETURN {
					place: place{.latitude, .longitude, .name, .address},
					events: collect(eventInPlace),
					distance:distance
				} AS result
				ORDER BY result.distance
				`,
      )
        .bind({
          latitude: location.latitude,
          longitude: location.longitude,
          radius,
          fromDate: DateTime.fromStandardDate(dateInterval.from),
          toDate: DateTime.fromStandardDate(dateInterval.to),
          categories,
        })
        .map((r) => {
          return {
            ...r,
            events: r.events.map((e) => {
              return {
                ...e,
                multimedia: TextUtils.escapeAndParse(e.multimedia),
                dateTimeInit: parseDate(e.dateTimeInit),
                dateTimeEnd: parseDate(e.dateTimeEnd),
              };
            }),
          };
        }),
    );
  }
}
