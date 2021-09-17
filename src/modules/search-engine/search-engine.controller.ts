import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HashtagQuery } from './search-services/hashtags/hashtag.query';
import { HashtagSearchService } from './search-services/hashtags/hashtag.search-service';

@ApiTags('search')
@Controller('/')
export class SearchEngineController {
  constructor(private hashtagService: HashtagSearchService) {}

  @Get('/hashtags/search')
  @ApiQuery({ name: 'q' })
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async searchHashtags(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ) {
    return this.hashtagService.search(new HashtagQuery(q), skip, limit);
  }
}
