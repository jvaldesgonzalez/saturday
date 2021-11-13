import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TopsReadService } from './tops.read-service';

@ApiBearerAuth()
@ApiTags('discover')
@Controller('discover')
export class TopsController {
  constructor(private topsService: TopsReadService) {}

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Get('cheaper-events')
  async getTopCheap(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ) {
    return await this.topsService.getTopCheap(skip, limit);
  }

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Get('best-selling-events')
  async getTopSellers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
  ) {
    return await this.topsService.getTopSellers(skip, limit);
  }
}
