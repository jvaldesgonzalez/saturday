import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { GetStoriesFromHostController } from './controllers/getStoriesFromHost/get-host-stories.controller';
import { GetStoriesFromHostResponse } from './controllers/getStoriesFromHost/response';

@ApiTags('stories')
@ApiBearerAuth()
@Controller('stories')
export class StoriesRouter {
  constructor(private getFromHostCtx: GetStoriesFromHostController) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiResponse({ status: 200, type: [GetStoriesFromHostResponse] })
  async getMyStories(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetStoriesFromHostResponse[]> {
    return this.getFromHostCtx.execute({ hostId: user.id });
  }
}
