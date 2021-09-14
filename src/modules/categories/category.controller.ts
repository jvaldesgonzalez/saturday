import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryEntity } from './infrastructure/entities/category.entity';
import * as _ from 'faker';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  @Get('')
  async getAll() {
    const cats = await this.persistenceManager.query<CategoryEntity>(
      QuerySpecification.withStatement(
        `MATCH (c:Category)
				return c`,
      ),
    );
    return cats.map((c) => {
      return {
        id: c.id,
        name: c.name,
        image: _.image.nightlife(),
      };
    });
  }
}
