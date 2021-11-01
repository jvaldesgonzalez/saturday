import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as _ from 'faker';
import { SkipAuth } from 'src/modules/accounts-management/auth/decorators/skip-auth.decorator';
import { LocationEntity } from './infrastructure/entities/location.entity';

@ApiBearerAuth()
@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  @SkipAuth()
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
        imageUrl: _.image.nightlife(),
      };
    });
  }
}
