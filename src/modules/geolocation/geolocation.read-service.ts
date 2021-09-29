import {
  InjectPersistenceManager,
  PersistenceManager,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { MapLocation } from 'src/shared/typedefs/map-location';

@Injectable()
export class GeolocationQueryService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  // async getNearEvents(
  //   location: MapLocation,
  //   radius: number,
  // ): Promise<PlaceWithEventsResponse>;
}
