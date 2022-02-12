import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { PlacesController } from './places.controller';

@Module({
  providers: [DataAccessModule],
  controllers: [PlacesController],
})
export class PlacesModule {}
