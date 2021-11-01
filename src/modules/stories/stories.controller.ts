import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { Stories } from './presentation/stories';
import { StoriesReadService } from './stories.read-service';

@ApiBearerAuth()
@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(private readService: StoriesReadService) {}

  @Get('')
  @ApiOkResponse({ type: [Stories] })
  async getStories(@CurrentUser() payload: JWTClaim) {
    return await this.readService.getStories(payload.id);
  }
}
