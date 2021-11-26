import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { SkipAuth } from '../accounts-management/auth/decorators/skip-auth.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { Theme } from './enums/themes.enum';
import { StaticsService } from './statics.service';

@ApiBearerAuth()
@ApiTags('statics')
@Controller('statics')
export class StaticsController {
  constructor(private service: StaticsService) {}

  @Get('/signed-urls/profiles/me')
  async getProfileSignedUrl(@CurrentUser() payload: JWTClaim) {
    return await this.service.getSignedUrl(`profile-${payload.username}`);
  }

  @Get('/signed-urls/media/')
  async getSignedUrl(@CurrentUser() payload: JWTClaim) {
    return await this.service.getSignedUrl(`media-${payload.username}`);
  }

  @SkipAuth()
  @Get('/default-profile-image')
  @ApiQuery({ name: 'theme', enum: Theme })
  async getDefaultImage(@Query('theme') theme: Theme, @Res() res: Response) {
    const url = await this.service.getDefaultProfileImageUrl(theme);
    res.redirect(url);
  }
}
