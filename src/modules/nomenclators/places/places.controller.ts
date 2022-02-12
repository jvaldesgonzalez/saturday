import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/modules/accounts-management/auth/decorators/skip-auth.decorator';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';

@ApiBearerAuth()
@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  @SkipAuth()
  @Get('')
  @ApiQuery({ name: 'q' })
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async getAll(
    @Query('q') query: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ): Promise<PaginatedFindResult<any>> {
    const q = `${query}* ${query}`;
    const places = await this.persistenceManager.query(
      QuerySpecification.withStatement(
        ` CALL db.index.fulltext.queryNodes('places',$q)
					YIELD node,score
					RETURN node
				`,
      )
        .bind({ q })
        .skip(skip)
        .limit(limit),
    );
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `CALL db.index.fulltext.queryNodes('places',$q)
					YIELD node,score
					RETURN count(node)
				`,
      ).bind({ q }),
    );
    return {
      items: places,
      total: total,
      pageSize: places.length,
      current: skip,
    };
  }
}
