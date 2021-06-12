import { Injectable } from '@nestjs/common';
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
    console.log(req);
    return;
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
