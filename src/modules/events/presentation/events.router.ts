import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { GetRecentEventsByHostController } from './controllers/getRecentHostEvents/get-recent-host-events.controller';
import { GetRecentHostEventsResponse } from './controllers/getRecentHostEvents/response';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsRouter {
  constructor(private getRecentsByHostCtx: GetRecentEventsByHostController) {}

  @UseGuards(JwtAuthGuard)
  @Get('/recents/me')
  @ApiResponse({ status: 200, type: [GetRecentHostEventsResponse] })
  async getMyStories(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetRecentHostEventsResponse[]> {
    return this.getRecentsByHostCtx.execute({ hostId: user.id });
  }
}
