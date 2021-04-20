import {
  DatabaseRegistry,
  DrivineModule,
  DrivineModuleOptions,
} from '@liberation-data/drivine';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    DrivineModule.withOptions(<DrivineModuleOptions>{
      connectionProviders: [DatabaseRegistry.buildOrResolveFromEnv()],
    }),
  ],
})
export class DataAccessModule {}
