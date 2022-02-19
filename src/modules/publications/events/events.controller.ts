import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
import { CreateEvent } from './application/usecases/createEvent/create-event.usecase';
import { EventsReadService } from './events.read-service';
import { CreateEventBody } from './presentation/create-event.body';
import { EventDetails } from './presentation/event-details';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readService: EventsReadService,
    private createEventUC: CreateEvent,
  ) {}

  @Get('/:id')
  @ApiOkResponse({ type: EventDetails })
  async getEventDetails(
    @Param('id') id: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    const event = await this.readService.getEventDetails(id, payload.id);
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
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getEventsWithHashtag(
      hashtagWord,
      skip,
      limit,
      payload.id,
    );
  }

  @Post('')
  async createEvent(
    @Body() data: CreateEventBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const result = await this.createEventUC.execute({
      ...data,
      publisher: payload.id,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}

@ApiTags('partners')
@ApiBearerAuth()
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
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getEventsByPartner(
      partnerId,
      payload.id,
      skip,
      limit,
    );
  }
}
