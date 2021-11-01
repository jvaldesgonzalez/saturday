import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EventsReadService } from './events.read-service';
import { EventDetails } from './presentation/event-details';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readService: EventsReadService) {}

  @Get('/:id')
  @ApiOkResponse({ type: EventDetails })
  async getEventDetails(@Param('id') id: string) {
    const event = await this.readService.getEventDetails(
      id,
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  @Get('/with-hashtag/:hashtagword')
  @ApiParam({ name: 'hashtagword', type: String })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  async getEventsWithHashtag(
    @Param('hashtagword') hashtagWord: string,
    @Query('skip', ParseIntPipe) skip: number = 0,
    @Query('take', ParseIntPipe) limit: number = 10,
  ) {
    return await this.readService.getEventsWithHashtag(
      hashtagWord,
      skip,
      limit,
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
  }
}

@ApiTags('partners')
@Controller('partners')
export class PartnerEventsController {
  constructor(private readService: EventsReadService) {}

  @Get('/:partnerId/publications/')
  @ApiParam({ name: 'partnerId', type: String })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @ApiOkResponse({ type: EventDetails })
  async getEventsByPartner(
    @Param('partnerId', ParseUUIDPipe) partnerId: string,
    @Query('skip', ParseIntPipe) skip: number = 0,
    @Query('take', ParseIntPipe) limit: number = 10,
  ) {
    return await this.readService.getEventsByPartner(
      partnerId,
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
      skip,
      limit,
    );
  }
}
