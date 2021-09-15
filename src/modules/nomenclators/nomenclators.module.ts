import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [CategoriesModule, LocationsModule],
})
export class NomenclatorsModule {}
