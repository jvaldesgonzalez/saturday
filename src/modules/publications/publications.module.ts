import { Module } from '@nestjs/common';
import { EventsController } from './events/events.controller';
import { EventsReadService } from './events/events.read-service';
import { PublicationsController } from './publications.controller';
import { PublicationsReadService } from './publications.read-service';

@Module({
  providers: [EventsReadService, PublicationsReadService],
  controllers: [EventsController, PublicationsController],
})
export class PublicationsModule {}
