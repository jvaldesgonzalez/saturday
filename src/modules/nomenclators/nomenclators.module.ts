import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { PlacesModule } from './places/places.module';

@Module({
  imports: [CategoriesModule, LocationsModule, PlacesModule],
})
export class NomenclatorsModule {}
