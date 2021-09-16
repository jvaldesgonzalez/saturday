import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CollectionsReadService } from './collections.read-service';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readService: CollectionsReadService) {}

  @Get(':id')
  @ApiParam({ name: 'id' })
  async getColllectionDetails(@Param('id') id: string) {
    return await this.readService.getCollectionDetails(id);
  }
}