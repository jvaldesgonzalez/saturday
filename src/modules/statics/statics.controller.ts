import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SkipAuth } from '../accounts-management/auth/decorators/skip-auth.decorator';
import { Theme } from './enums/themes.enum';
import { StaticsService } from './statics.service';

@ApiBearerAuth()
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

  @SkipAuth()
  @Get('/default-profile-image')
  @ApiQuery({ name: 'theme', enum: Theme })
  async getDefaultImage(@Query('theme') theme: Theme, @Res() res: Response) {
    const url = await this.service.getDefaultProfileImageUrl(theme);
    res.redirect(url);
  }

  @Get('/signed-urls/events/')
  @ApiQuery({ name: 'name' })
  async getEventSignedUrl(@Query('name') id: string) {
    return await this.service.getSignedUrl(`event-${id}`);
  }
}
