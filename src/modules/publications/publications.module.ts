import { Module } from '@nestjs/common';
import { CollectionsController } from './collections/collections.controller';
import { CollectionsReadService } from './collections/collections.read-service';
import { EventsController } from './events/events.controller';
import { EventsReadService } from './events/events.read-service';
import { PublicationsController } from './publications.controller';
import { PublicationsReadService } from './publications.read-service';

@Module({
  providers: [
    EventsReadService,
    PublicationsReadService,
    CollectionsReadService,
  ],
  controllers: [
    EventsController,
    PublicationsController,
    CollectionsController,
  ],
})
export class PublicationsModule {}
