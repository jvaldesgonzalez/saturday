import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'faker';
import { LocationEntity } from './infrastructure/entities/location.entity';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  @Get('')
  async getAll() {
    const locs = await this.persistenceManager.query<LocationEntity>(
      QuerySpecification.withStatement(
        `MATCH (c:Location)
				return c`,
      ),
    );
    return locs.map((l) => {
      return {
        id: l.id,
        name: l.name,
        image: _.image.nightlife(),
      };
    });
  }
}
