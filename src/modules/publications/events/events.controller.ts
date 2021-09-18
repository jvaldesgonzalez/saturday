import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventsReadService } from './events.read-service';
import { EventDetails } from './presentation/event-details';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readService: EventsReadService) {}

  @Get('/:id')
  @ApiOkResponse({ type: EventDetails })
  async getEventDetails(@Param('id') id: string) {
    const event = await this.readService.getEventDetails(id);
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }
}
