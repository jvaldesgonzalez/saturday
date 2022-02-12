import { Module } from '@nestjs/common';
import { CollectionsController } from './collections/collections.controller';
import { CollectionsReadService } from './collections/collections.read-service';
import eventsUseCases from './events/application/usecases';
import {
  EventsController,
  PartnerEventsController,
} from './events/events.controller';
import { EventsReadService } from './events/events.read-service';
import { EventRepository } from './events/infrastructure/repository/event.repository';
import { EventProviders } from './events/providers/event.providers.enum';
import { PublicationsController } from './publications.controller';
import { PublicationsReadService } from './publications.read-service';

@Module({
  providers: [
    EventsReadService,
    PublicationsReadService,
    CollectionsReadService,
    ...eventsUseCases,
    {
      provide: EventProviders.IEventRepository,
      useClass: EventRepository,
    },
  ],
  controllers: [
    EventsController,
    PublicationsController,
    CollectionsController,
    PartnerEventsController,
  ],
})
export class PublicationsModule {}
