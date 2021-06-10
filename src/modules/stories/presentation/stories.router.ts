import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { CreateStoryController } from './controllers/createStory/create-story.controller';
import { CreateStoryBody } from './controllers/createStory/request';
import { CreateStoryResponse } from './controllers/createStory/response';
import { GetStoriesFromHostController } from './controllers/getStoriesFromHost/get-host-stories.controller';
import { GetStoriesFromHostResponse } from './controllers/getStoriesFromHost/response';

@ApiTags('stories')
@ApiBearerAuth()
@Controller('stories')
export class StoriesRouter {
  constructor(
    private getFromHostCtx: GetStoriesFromHostController,
    private createStoryCtx: CreateStoryController,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiResponse({ status: 200, type: [GetStoriesFromHostResponse] })
  async getMyStories(
    @CurrentUser() user: JWTClaims,
  ): Promise<GetStoriesFromHostResponse[]> {
    return this.getFromHostCtx.execute({ hostId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiResponse({ status: 200, type: CreateStoryResponse })
  async createStory(
    @CurrentUser() user: JWTClaims,
    @Body() data: CreateStoryBody,
  ): Promise<CreateStoryResponse> {
    return this.createStoryCtx.execute({ publisher: user.id, ...data });
  }
}
