import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventsReadService } from './events.read-service';
import { EventDetails } from './presentation/event-details';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readService: EventsReadService) {}

  @Get('/liked')
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async getHome(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ) {
    return await this.readService.getEventsLikedByUser('blabla', skip, limit);
  }

  @Get('/:id')
  @ApiOkResponse({ type: EventDetails })
  async getEventDetails(@Param('id') id: string) {
    const event = await this.readService.getEventDetails(id);
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }
}
