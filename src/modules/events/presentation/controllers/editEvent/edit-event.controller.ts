import { Injectable } from '@nestjs/common';
import { EditEventErrors } from 'src/modules/events/application/events/use-cases/editEvent/edit-event.errors';
import { EditEventUseCase } from 'src/modules/events/application/events/use-cases/editEvent/edit-event.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { EditEventRequest } from './request';
import { EditEventResponse } from './response';

@Injectable()
export class EditEventController extends BaseController<
  EditEventRequest,
  EditEventResponse
> {
  constructor(private useCase: EditEventUseCase) {
    super('CreateEventController');
  }
  protected async executeImpl(
    req: EditEventRequest,
  ): Promise<EditEventResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EditEventErrors.EventDoestnExists:
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
