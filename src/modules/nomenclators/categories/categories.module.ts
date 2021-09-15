import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { CategoriesController } from './categories.controller';

@Module({
  providers: [DataAccessModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
