import { Module } from '@nestjs/common';
import { CreateNotification } from '../notifications/application/use-cases/createNotification/create-notification.usecase';
import { NotificationsModule } from '../notifications/notifications.module';
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
  imports: [NotificationsModule],
  providers: [
    EventsReadService,
    PublicationsReadService,
    CollectionsReadService,
    CreateNotification, //use case for notifications, needed in publishEvent usecase
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
