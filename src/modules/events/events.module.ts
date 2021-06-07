import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import { EventOccurrenceRepository } from './infrastruture/repositories/implementations/event-occurrence.repository';
import { EventRepository } from './infrastruture/repositories/implementations/event.repository';
import { EventRepositoryFactory } from './infrastruture/repositories/implementations/event.repository.factory';
import eventsControllers from './presentation/controllers';
import { EventsRouter } from './presentation/events.router';

@Module({
  imports: [DataAccessModule],
  providers: [
    {
      provide: 'IEventOccurrenceRepository',
      useClass: EventOccurrenceRepository,
    },
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
    {
      provide: 'IRepositoryFactory',
      useClass: EventRepositoryFactory,
    },
    {
      provide: 'IUnitOfWorkFactory',
      useClass: Neo4jUnitOfWorkFactory,
    },
    ...eventsControllers,
  ],
  controllers: [EventsRouter],
})
export class EventsModule {}
