import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { CategoryController } from './category.controller';

@Module({
  providers: [DataAccessModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
