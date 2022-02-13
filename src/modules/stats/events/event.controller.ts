import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/accounts-management/auth/decorators/current-user.decorator';
import { Roles } from 'src/modules/accounts-management/auth/decorators/role.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { EventsReadService } from './event.read-service';

@ApiBearerAuth()
@ApiTags('stats/events')
@Controller('stats/events')
export class EventsController {
  constructor(private eventsService: EventsReadService) {}

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Roles(EnumRoles.Partner)
  @Get('')
  async getEventListStats(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.eventsService.getEventStatsListByPartner(
      payload.id,
      skip,
      limit,
    );
  }

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Get('best-selling-events')
  async getTopSellers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ) {
    return;
    // return await this.eventsService.getTopSellers(skip, limit);
  }
}
