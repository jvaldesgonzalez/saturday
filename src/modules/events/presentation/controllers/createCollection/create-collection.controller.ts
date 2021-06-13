import { Injectable } from '@nestjs/common';
import { CreateCollectionErrors } from 'src/modules/events/application/collections/use-cases/createCollection/create-collection.errors';
import { CreateCollectionUseCase } from 'src/modules/events/application/collections/use-cases/createCollection/create-collection.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { CreateCollectionRequest } from './request';
import { CreateCollectionResponse } from './response';

@Injectable()
export class CreateCollectionController extends BaseController<
  CreateCollectionRequest,
  CreateCollectionResponse
> {
  constructor(private useCase: CreateCollectionUseCase) {
    super('CreateCollectionController');
  }
  protected async executeImpl(
    req: CreateCollectionRequest,
  ): Promise<CreateCollectionResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CreateCollectionErrors.AllEventMustExists:
          this.conflict(error.errorValue().message);
        default:
          this.fail(error.errorValue().message);
          break;
      }
    } else {
      return;
    }
  }
}
