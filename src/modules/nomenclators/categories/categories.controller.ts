import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/modules/accounts-management/auth/decorators/skip-auth.decorator';
import { CategoryEntity } from './infrastructure/entities/category.entity';

@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  @SkipAuth()
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
        imageUrl: c.imageUrl,
      };
    });
  }
}
