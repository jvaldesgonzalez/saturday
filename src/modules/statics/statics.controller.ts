import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { StaticsService } from './statics.service';

@ApiTags('statics')
@Controller('statics')
export class StaticsController {
  constructor(private service: StaticsService) {}

  @Get('/signed-urls/profiles/me')
  async getProfileSignedUrl() {
    return await this.service.getSignedUrl(
      `profile-777cc88c-2e3f-4eb4-ac81-14c9323c541d`,
    );
  }

  @Get('/signed-urls/events/')
  @ApiQuery({ name: 'name' })
  async getEventSignedUrl(@Query('name') id: string) {
    return await this.service.getSignedUrl(`event-${id}`);
  }
}
