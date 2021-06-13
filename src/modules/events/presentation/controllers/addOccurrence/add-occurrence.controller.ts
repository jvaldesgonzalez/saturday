import { Injectable } from '@nestjs/common';
import { AddOccurrenceErrors } from 'src/modules/events/application/events/use-cases/addOccurrence/add-occurrence.errors';
import { AddOccurrenceUseCase } from 'src/modules/events/application/events/use-cases/addOccurrence/add-occurrence.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { AddOccurrenceRequest } from './request';
import { AddOccurrenceResponse } from './response';

@Injectable()
export class AddOccurrenceController extends BaseController<
  AddOccurrenceRequest,
  AddOccurrenceResponse
> {
  constructor(private useCase: AddOccurrenceUseCase) {
    super('CreateEventController');
  }
  protected async executeImpl(
    req: AddOccurrenceRequest,
  ): Promise<AddOccurrenceResponse> {
    req.dateTimeEnd = new Date(req.dateTimeEnd);
    req.dateTimeInit = new Date(req.dateTimeInit);

    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case AddOccurrenceErrors.EventDoestnExists:
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
