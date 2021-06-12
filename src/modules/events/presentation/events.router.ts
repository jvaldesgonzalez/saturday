import {
  Controller,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { GetEventStatsResponse } from 'src/shared/modules/stats/types/responses/get-event-stats.response';
import { AddOccurrenceController } from './controllers/addOccurrence/add-occurrence.controller';
import { AddOccurrenceRequest } from './controllers/addOccurrence/request';
import { AddOccurrenceResponse } from './controllers/addOccurrence/response';
import { CreateEventController } from './controllers/createEvent/create-event.controller';
import { CreateEventBody } from './controllers/createEvent/request';
import { CreateEventResponse } from './controllers/createEvent/response';
import { DeleteOccurrenceController } from './controllers/deleteOccurrence/delete-occurrence.controller';
import { DeleteOccurrenceResponse } from './controllers/deleteOccurrence/response';
import { EditEventController } from './controllers/editEvent/edit-event.controller';
import { EditEventResponse } from './controllers/editEvent/response';
import { GetEventDetailsController } from './controllers/getEventDetails/get-event-details.controller';
import {
  GetHostPublicationsController,
  PaginatedGetHostPublicationsResponse,
} from './controllers/getHostPublications/get-host-publications.controller';
import { GetRecentEventsByHostController } from './controllers/getRecentHostEvents/get-recent-host-events.controller';
import { GetRecentHostEventsResponse } from './controllers/getRecentHostEvents/response';
import { GetTicketsByHostController } from './controllers/getTicketsByHost/get-tickets-by-host.controller';
import { GetTicketsByHostResponse } from './controllers/getTicketsByHost/response';
import { GetTicketsByOccurrenceController } from './controllers/getTicketsByOccurrence/get-tickets-by-occurrence.controller';
import { GetTicketsByOccurrenceResponse } from './controllers/getTicketsByOccurrence/response';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsRouter {
  constructor(
    private getRecentsByHostCtx: GetRecentEventsByHostController,
    private getTicketsByHostCtx: GetTicketsByHostController,
    private getTicketsByOccurrenceCtx: GetTicketsByOccurrenceController,
    private getHostPublicationsCtx: GetHostPublicationsController,
    private getEventDetailsCtx: GetEventDetailsController,
    private createEventCtx: CreateEventController,
    private editEventCtx: EditEventController,
    private addOccurrenceCtx: AddOccurrenceController,
    private deleteOccurrenceCtx: DeleteOccurrenceController,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/recents/')
  @ApiResponse({ status: 200, type: [GetRecentHostEventsResponse] })
  async getMyStories(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetRecentHostEventsResponse[]> {
    return this.getRecentsByHostCtx.execute({ hostId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/occurrences/tickets/')
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

  @UseGuards(JwtAuthGuard)
  @Get('/occurrences/:id/tickets')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: GetTicketsByOccurrenceResponse })
  async getTicketsByOccurrence(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
  ): Promise<GetTicketsByOccurrenceResponse> {
    return this.getTicketsByOccurrenceCtx.execute({
      hostId: user.id,
      occurrenceId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiQuery({ name: 'from' })
  @ApiQuery({ name: 'size' })
  // @ApiResponse({ status: 200, type: Paginatedd})
  async getPublications(
    @CurrentUser() user: JWTClaims,
    @Query('from', ParseIntPipe) from = 0,
    @Query('size', ParseIntPipe) size = 0,
  ): Promise<PaginatedGetHostPublicationsResponse> {
    return this.getHostPublicationsCtx.execute({ hostId: user.id, from, size });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOkResponse({ type: GetEventStatsResponse })
  async getOccurrenceStats(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
  ): Promise<GetEventStatsResponse> {
    return this.getEventDetailsCtx.execute({
      hostId: user.id,
      eventId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiResponse({ status: 200, type: [CreateEventResponse] })
  async createEvent(
    @CurrentUser() user: JWTClaims,
    @Body() data: CreateEventBody,
  ): Promise<CreateEventResponse> {
    return this.createEventCtx.execute({ publisher: user.id, ...data });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [EditEventResponse] })
  async editEvent(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
    @Body() data: EditEventResponse,
  ): Promise<EditEventResponse> {
    return this.editEventCtx.execute({
      eventId: id,
      publisher: user.id,
      ...data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/occurrences')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [AddOccurrenceResponse] })
  async addOccurrence(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
    @Body() data: AddOccurrenceRequest,
  ): Promise<AddOccurrenceResponse> {
    return this.addOccurrenceCtx.execute({
      eventId: id,
      publisher: user.id,
      ...data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/occurrences/:id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [DeleteOccurrenceResponse] })
  async deleteOccurrence(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
  ): Promise<DeleteOccurrenceResponse> {
    return this.deleteOccurrenceCtx.execute({
      occurrenceId: id,
      publisher: user.id,
    });
  }
}
