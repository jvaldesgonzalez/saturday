import { Injectable } from '@nestjs/common';
import { DeleteStoryErrors } from 'src/modules/stories/application/stories/use-cases/deleteStory/delete-story.errors';
import { DeleteStoryUseCase } from 'src/modules/stories/application/stories/use-cases/deleteStory/delete-story.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { DeleteStoryRequest } from './request';
import { DeleteStoryResponse } from './response';

@Injectable()
export class DeleteStoryController extends BaseController<
  DeleteStoryRequest,
  DeleteStoryResponse
> {
  constructor(private useCase: DeleteStoryUseCase) {
    super('CreateStoryController');
  }

  protected async executeImpl(
    req: DeleteStoryRequest,
  ): Promise<DeleteStoryResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case DeleteStoryErrors.StoryNotFound:
          this.notFound(error.errorValue().message);
        default:
          this.fail(error.errorValue().message);
      }
    } else {
      return;
    }
  }
}
