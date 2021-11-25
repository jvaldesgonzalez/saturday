import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { SkipAuth } from '../accounts-management/auth/decorators/skip-auth.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { DeleteStoryErrors } from './application/use-cases/deleteStory/delete-story.errors';
import { DeleteStory } from './application/use-cases/deleteStory/delete-story.usecase';
import { CreateStory } from './application/use-cases/publishStory/publish-story.usecase';
import { CreateStoryBody } from './presentation/create-story';
import { Stories } from './presentation/stories';
import { StoriesReadService } from './stories.read-service';

@ApiBearerAuth()
@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(
    private readService: StoriesReadService,
    private createStoryUC: CreateStory,
    private deleteStoryUC: DeleteStory,
  ) {}

  @Get('')
  @ApiOkResponse({ type: [Stories] })
  async getStories(@CurrentUser() payload: JWTClaim) {
    return await this.readService.getStories(payload.id);
  }

  @SkipAuth()
  @Post('/')
  async createStory(
    @CurrentUser() user: JWTClaim,
    @Body() data: CreateStoryBody,
  ) {
    const result = await this.createStoryUC.execute({
      ...data,
      publisher: 'f66f2836-f230-4a5b-83b4-c92f54d4156f',
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      return;
    }
  }

  @SkipAuth()
  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async deleteStory(
    @CurrentUser() user: JWTClaim,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this.deleteStoryUC.execute({
      partnerId: 'f66f2836-f230-4a5b-83b4-c92f54d4156f',
      storyId: id,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case DeleteStoryErrors.StoryNotFound:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      return;
    }
  }
}
