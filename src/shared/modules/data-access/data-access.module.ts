import { Global, Module } from '@nestjs/common';
import { driver } from './neo4j/provider.neo4j';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useValue: driver,
    },
  ],
  exports: [
    {
      provide: 'NEO4J_DRIVER',
      useValue: driver,
    },
  ],
})
export class DataAccessModule {}
