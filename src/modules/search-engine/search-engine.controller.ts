import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountQuery } from './search-services/accounts/account.query';
import { HashtagQuery } from './search-services/hashtags/hashtag.query';
import { HashtagSearchService } from './search-services/hashtags/hashtag.search-service';

@ApiTags('search')
@Controller('search')
export class SearchEngineController {
  constructor(private hashtagService: HashtagSearchService) {}

  @Get('hashtag')
  @ApiQuery({ name: 'q' })
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async searchHashtags(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ) {
    const query = new HashtagQuery(q);
    if (query.processedQuery.length === 0)
      throw new BadRequestException('q must not be empty');
    return this.hashtagService.search(new HashtagQuery(q), skip, limit);
  }

  @Get('/test')
  testQuery(@Query('q') q: string) {
    return new AccountQuery(q).processedQuery;
  }
}
