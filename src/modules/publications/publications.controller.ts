import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PublicationsReadService } from './publications.read-service';

@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private readService: PublicationsReadService) {}

  @Get('home')
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'limit' })
  async getHome(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.readService.getHome(limit, skip);
  }
}
