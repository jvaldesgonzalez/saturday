import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { LocationsController } from './locations.controller';

@Module({
  providers: [DataAccessModule],
  controllers: [LocationsController],
})
export class LocationsModule {}
