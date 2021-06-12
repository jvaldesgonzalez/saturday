import { Injectable } from '@nestjs/common';
import { CreateEventUseCase } from 'src/modules/events/application/events/use-cases/createEvent/create-event.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { CreateEventRequest } from './request';
import { CreateEventResponse } from './response';

@Injectable()
export class CreateEventController extends BaseController<
  CreateEventRequest,
  CreateEventResponse
> {
  constructor(private useCase: CreateEventUseCase) {
    super('CreateEventController');
  }
  protected async executeImpl(
    req: CreateEventRequest,
  ): Promise<CreateEventResponse> {
    for (const occur of req.occurrences) {
      occur.dateTimeEnd = new Date(occur.dateTimeEnd);
      occur.dateTimeInit = new Date(occur.dateTimeInit);
    }
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        default:
          this.fail(error.errorValue().message);
          break;
      }
    } else {
      return;
    }
  }
}
