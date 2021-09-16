import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Stories } from './presentation/stories';
import { StoriesReadService } from './stories.read-service';

@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(private readService: StoriesReadService) {}

  @Get('')
  @ApiOkResponse({ type: [Stories] })
  async getStories() {
    return await this.readService.getStories('blabla');
  }
}
