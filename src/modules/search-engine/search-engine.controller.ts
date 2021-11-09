import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { GetCombinedProcessed } from './common/search-query.abstract';
import { FilterEventsBody } from './presentation/search-event';
import { AccountQuery } from './search-services/accounts/account.query';
import { AccountSearchService } from './search-services/accounts/accounts.search-service';
import { EventQuery } from './search-services/events/events.query';
import { EventSearchService } from './search-services/events/events.search-service';
import { GeneralSearchService } from './search-services/general/general.search-service';
import { HashtagQuery } from './search-services/hashtags/hashtag.query';
import { HashtagSearchService } from './search-services/hashtags/hashtag.search-service';

@ApiBearerAuth()
@ApiTags('search')
@Controller('search')
export class SearchEngineController {
  constructor(
    private hashtagService: HashtagSearchService,
    private accountsService: AccountSearchService,
    private eventsService: EventSearchService,
    private generalService: GeneralSearchService,
  ) {}

  @Get('hashtags')
  @ApiQuery({ name: 'q' })
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async searchHashtags(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    const query = new HashtagQuery(q);
    if (query.processedQuery.length === 0)
      throw new BadRequestException('q must not be empty');
    return this.hashtagService.search(
      new HashtagQuery(q),
      skip,
      limit,
      payload.id,
    );
  }

  @Get('profiles')
  @ApiQuery({ name: 'q' })
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async searchAccounts(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    const query = new AccountQuery(q);
    if (query.processedQuery.length === 0)
      throw new BadRequestException('q must not be empty');
    return this.accountsService.search(query, skip, limit, payload.id);
  }

  @Get('events')
  @ApiQuery({ name: 'q' })
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async searchEvents(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @Body() data: FilterEventsBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const query = new EventQuery(q);
    if (q.length === 0) throw new BadRequestException('q must not be empty');
    return this.eventsService.search(
      query,
      skip,
      limit,
      payload.id,
      data.dateInterval,
      data.categories,
      data.priceInterval,
      data.locationId,
    );
  }

  @Get('/')
  @ApiQuery({ name: 'q' })
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async searchAll(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    const query = GetCombinedProcessed(
      new EventQuery(q),
      new AccountQuery(q),
      new HashtagQuery(q),
    );
    console.log(query.processedQuery);
    if (query.processedQuery.length === 0)
      throw new BadRequestException('q must not be empty');
    return await this.generalService.search(query, skip, limit, payload.id);
  }
}
