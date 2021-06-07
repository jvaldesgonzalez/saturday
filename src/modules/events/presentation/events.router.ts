import {
  Controller,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { GetRecentEventsByHostController } from './controllers/getRecentHostEvents/get-recent-host-events.controller';
import { GetRecentHostEventsResponse } from './controllers/getRecentHostEvents/response';
import { GetTicketsByHostController } from './controllers/getTicketsByHost/get-tickets-by-host.controller';
import { GetTicketsByHostResponse } from './controllers/getTicketsByHost/response';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsRouter {
  constructor(
    private getRecentsByHostCtx: GetRecentEventsByHostController,
    private getTicketsByHostCtx: GetTicketsByHostController,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/recents/me')
  @ApiResponse({ status: 200, type: [GetRecentHostEventsResponse] })
  async getMyStories(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetRecentHostEventsResponse[]> {
    return this.getRecentsByHostCtx.execute({ hostId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tickets/me')
  @ApiQuery({ name: 'from' })
  @ApiQuery({ name: 'size' })
  // @ApiResponse({ status: 200, type: PaginatedFindResult<GetTicketsByHostResponse> })
  async getMyTickets(
    @CurrentUser() user: JWTClaims,
    @Query('from', ParseIntPipe) from = 0,
    @Query('size', ParseIntPipe) size = 0,
  ): Promise<PaginatedFindResult<GetTicketsByHostResponse>> {
    return this.getTicketsByHostCtx.execute({ hostId: user.id, from, size });
  }
}
