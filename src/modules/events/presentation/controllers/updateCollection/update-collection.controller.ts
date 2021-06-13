import { Injectable } from '@nestjs/common';
import { UpdateCollectionErrors } from 'src/modules/events/application/collections/use-cases/updateCollection/update-collection.errors';
import { UpdateCollectionUseCase } from 'src/modules/events/application/collections/use-cases/updateCollection/update-collection.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { UpdateCollectionRequest } from './request';
import { UpdateCollectionResponse } from './response';

@Injectable()
export class UpdateCollectionController extends BaseController<
  UpdateCollectionRequest,
  UpdateCollectionResponse
> {
  constructor(private useCase: UpdateCollectionUseCase) {
    super('UpdateCollectionController');
  }
  protected async executeImpl(
    req: UpdateCollectionRequest,
  ): Promise<UpdateCollectionResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UpdateCollectionErrors.CollectionNotFound:
          this.notFound(error.errorValue().message);
        default:
          this.fail(error.errorValue().message);
          break;
      }
    } else {
      return;
    }
  }
}
