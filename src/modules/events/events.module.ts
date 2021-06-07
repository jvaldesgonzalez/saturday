import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import { EventRepository } from './infrascruture/repositories/implementations/event.repository';
import { EventRepositoryFactory } from './infrascruture/repositories/implementations/event.repository.factory';

@Module({
  imports: [DataAccessModule],
  providers: [
    // {
    //   provide:'IEventOccurrenceRepository',
    //   useClass:
    // },
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
  ],
})
export class EventsModule {}
