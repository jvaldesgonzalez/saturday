import { Injectable } from '@nestjs/common';
import { AddEventErrors } from 'src/modules/events/application/collections/use-cases/addEvent/add-event.errors';
import { AddEventUseCase } from 'src/modules/events/application/collections/use-cases/addEvent/add-event.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { AddEventToCollectionRequest } from './request';
import { AddEventToCollectionResponse } from './response';

@Injectable()
export class AddEventToCollectionController extends BaseController<
  AddEventToCollectionRequest,
  AddEventToCollectionResponse
> {
  constructor(private useCase: AddEventUseCase) {
    super('AddEventToCollectionController');
  }
  protected async executeImpl(
    req: AddEventToCollectionRequest,
  ): Promise<AddEventToCollectionResponse> {
    console.log(req);
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case AddEventErrors.CollectionNotFound:
          this.notFound(error.errorValue().message);
        case AddEventErrors.EventNotFound:
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
