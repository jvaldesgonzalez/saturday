import { Injectable } from '@nestjs/common';
import { DeleteOccurrenceErrors } from 'src/modules/events/application/events/use-cases/deleteOccurrence/delete-occurrence.errors';
import { DeleteOccurrenceUseCase } from 'src/modules/events/application/events/use-cases/deleteOccurrence/delete-occurrence.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { DeleteOccurrenceRequest } from './request';
import { DeleteOccurrenceResponse } from './response';

@Injectable()
export class DeleteOccurrenceController extends BaseController<
  DeleteOccurrenceRequest,
  DeleteOccurrenceResponse
> {
  constructor(private useCase: DeleteOccurrenceUseCase) {
    super();
  }

  protected async executeImpl(
    req: DeleteOccurrenceRequest,
  ): Promise<DeleteOccurrenceResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case DeleteOccurrenceErrors.OccurrenceDoesntExist:
          this.notFound(error.errorValue().message);
          break;

        default:
          this.fail(error.errorValue().message);
      }
    } else {
      return;
    }
  }
}
