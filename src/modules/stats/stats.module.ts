import { Module } from '@nestjs/common';
import { EventsController } from './events/event.controller';
import { EventsReadService } from './events/event.read-service';
import { TopsController } from './tops/tops.controller';
import { TopsReadService } from './tops/tops.read-service';

@Module({
  providers: [TopsReadService, EventsReadService],
  controllers: [TopsController, EventsController],
})
export class StatsModule {}
