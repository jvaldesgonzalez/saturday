import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { CreateStoryController } from './controllers/createStory/create-story.controller';
import { CreateStoryBody } from './controllers/createStory/request';
import { CreateStoryResponse } from './controllers/createStory/response';
import { DeleteStoryController } from './controllers/deleteStory/create-story.controller';
import { DeleteStoryResponse } from './controllers/deleteStory/response';
import { GetStoriesFromHostController } from './controllers/getStoriesFromHost/get-host-stories.controller';
import { GetStoriesFromHostResponse } from './controllers/getStoriesFromHost/response';

@ApiTags('stories')
@ApiBearerAuth()
@Controller('stories')
export class StoriesRouter {
  constructor(
    private getFromHostCtx: GetStoriesFromHostController,
    private createStoryCtx: CreateStoryController,
    private deleteStoryCtx: DeleteStoryController,
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: DeleteStoryResponse })
  async deleteStory(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
  ): Promise<DeleteStoryResponse> {
    return this.deleteStoryCtx.execute({ hostId: user.id, storyId: id });
  }
}
