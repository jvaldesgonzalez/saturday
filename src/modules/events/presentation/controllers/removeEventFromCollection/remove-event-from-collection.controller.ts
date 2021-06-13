import { Injectable } from '@nestjs/common';
import { RemoveEventErrors } from 'src/modules/events/application/collections/use-cases/removeEvent/remove-event.errors';
import { RemoveEventUseCase } from 'src/modules/events/application/collections/use-cases/removeEvent/remove-event.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { RemoveEventFromCollectionRequest } from './request';
import { RemoveEventFromCollectionResponse } from './response';

@Injectable()
export class RemoveEventFromCollectionController extends BaseController<
  RemoveEventFromCollectionRequest,
  RemoveEventFromCollectionResponse
> {
  constructor(private useCase: RemoveEventUseCase) {
    super('RemoveEventFromCollectionController');
  }
  protected async executeImpl(
    req: RemoveEventFromCollectionRequest,
  ): Promise<RemoveEventFromCollectionResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case RemoveEventErrors.CollectionNotFound:
          this.notFound(error.errorValue().message);
        case RemoveEventErrors.EventNotFound:
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
