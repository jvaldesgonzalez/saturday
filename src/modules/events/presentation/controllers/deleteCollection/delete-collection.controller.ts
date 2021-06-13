import { Injectable } from '@nestjs/common';
import { DeleteCollectionErrors } from 'src/modules/events/application/collections/use-cases/deleteCollection/delete-collection.errors';
import { DeleteCollectionUseCase } from 'src/modules/events/application/collections/use-cases/deleteCollection/delete-collection.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { DeleteCollectionRequest } from './request';
import { DeleteCollectionResponse } from './response';

@Injectable()
export class DeleteCollectionController extends BaseController<
  DeleteCollectionRequest,
  DeleteCollectionResponse
> {
  constructor(private useCase: DeleteCollectionUseCase) {
    super('DeleteCollectionController');
  }
  protected async executeImpl(
    req: DeleteCollectionRequest,
  ): Promise<DeleteCollectionResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case DeleteCollectionErrors.CollectionNotFound:
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
