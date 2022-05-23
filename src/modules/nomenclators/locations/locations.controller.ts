import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/accounts-management/auth/decorators/current-user.decorator';
import { SkipAuth } from 'src/modules/accounts-management/auth/decorators/skip-auth.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
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
        imageUrl: l.imageUrl,
        latitude: l.latitude,
        longitude: l.longitude,
      };
    });
  }

  @Get('me')
  async getMyLocation(@CurrentUser() payload: JWTClaim) {
    const locs = await this.persistenceManager.query<LocationEntity>(
      QuerySpecification.withStatement(
        `MATCH (c:Location)--(u:User)
					WHERE u.id = $uId
				return c`,
      ).bind({ uId: payload.id }),
    );
    return locs.map((l) => {
      return {
        id: l.id,
        name: l.name,
        imageUrl: l.imageUrl,
        latitude: l.latitude,
        longitude: l.longitude,
      };
    });
  }
}
