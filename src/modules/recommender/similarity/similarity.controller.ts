import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SimilarityReadService } from './similarity.read-service';

@ApiBearerAuth()
@ApiTags('similarity')
@Controller('similarity')
export class SimilarityController {
  constructor(private readService: SimilarityReadService) {}

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Get('/accounts/me')
  async getSimilarAccounts(
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('take', ParseIntPipe) limit = 8,
  ) {
    return await this.readService.getSimilarAccounts(
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
      skip,
      limit,
    );
  }

  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  @Get('/events/:eventId')
  async getSimilarEvents(
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('take', ParseIntPipe) limit = 8,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    return await this.readService.getSimilarEvents(
      eventId,
      skip,
      limit,
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
  }
}
