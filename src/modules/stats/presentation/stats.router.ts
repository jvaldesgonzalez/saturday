import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { GetEventStatsController } from './controllers/getEventStats/get-event-stats.controller';
import { GetEventStatsResponse } from './controllers/getEventStats/response';
import { GetHostStatsController } from './controllers/getHostStats/get-host-stats.controller';
import { GetHostStatsResponse } from './controllers/getHostStats/response';
import { GetStatsResumeByHost } from './controllers/getResumeByHost/get-resume-by-host.controller';
import { GetResumeByHostResponse } from './controllers/getResumeByHost/response';

@ApiTags('stats')
@ApiBearerAuth()
@Controller('stats')
export class StatsRouter {
  constructor(
    private getResumeByHostCtx: GetStatsResumeByHost,
    private getEventStatsCtx: GetEventStatsController,
    private getHostStatsCtx: GetHostStatsController,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('hosts/me/resume')
  @ApiOkResponse({ type: GetResumeByHostResponse })
  async getMyResume(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetResumeByHostResponse> {
    return this.getResumeByHostCtx.execute({ hostId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:id')
  @ApiOkResponse({ type: GetEventStatsResponse })
  async getOccurrenceStats(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
  ): Promise<GetEventStatsResponse> {
    return this.getEventStatsCtx.execute({
      hostId: user.id,
      eventId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('hosts/me')
  @ApiQuery({ name: 'fromDate', type: Date })
  @ApiQuery({ name: 'toDate', type: Date })
  @ApiOkResponse({ type: GetHostStatsResponse })
  async getHostStats(
    @CurrentUser() user: JWTClaims,
    @Query('fromDate') fromDate: Date,
    @Query('toDate') toDate: Date,
  ): Promise<GetHostStatsResponse> {
    return this.getHostStatsCtx.execute({ hostId: user.id, fromDate, toDate });
  }
}
