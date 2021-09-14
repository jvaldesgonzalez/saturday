import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { LocationController } from './location.controller';

@Module({
  providers: [DataAccessModule],
  controllers: [LocationController],
})
export class LocationModule {}
