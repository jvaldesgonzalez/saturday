import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PublicationsReadService } from './publications.read-service';

@ApiBearerAuth()
@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private readService: PublicationsReadService) {}

  @Get('home')
  @ApiQuery({ name: 'skip' })
  @ApiQuery({ name: 'take' })
  async getHome(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ) {
    return await this.readService.getHome(
      limit,
      skip,
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
  }
}
