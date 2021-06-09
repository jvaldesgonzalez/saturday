import { Injectable } from '@nestjs/common';
import { CreateStoryUseCase } from 'src/modules/stories/application/stories/use-cases/createStory/create-story.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { CreateStoryRequest } from './request';
import { CreateStoryResponse } from './response';

@Injectable()
export class CreateStoryController extends BaseController<
  CreateStoryRequest,
  CreateStoryResponse
> {
  constructor(private useCase: CreateStoryUseCase) {
    super('CreateStoryController');
  }

  protected async executeImpl(
    req: CreateStoryRequest,
  ): Promise<CreateStoryResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        default:
          this.fail(error.errorValue().message);
      }
    } else {
      return;
    }
  }
}
