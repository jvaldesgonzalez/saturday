import { Injectable } from '@nestjs/common';
import { RemoveTicketErrors } from 'src/modules/events/application/events/use-cases/removeTicket/remove-ticket.errors';
import { RemoveTicketUseCase } from 'src/modules/events/application/events/use-cases/removeTicket/remove-ticket.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { DeleteTicketRequest } from './request';
import { DeleteTicketResponse } from './response';

@Injectable()
export class DeleteTicketController extends BaseController<
  DeleteTicketRequest,
  DeleteTicketResponse
> {
  constructor(private useCase: RemoveTicketUseCase) {
    super();
  }

  protected async executeImpl(
    req: DeleteTicketRequest,
  ): Promise<DeleteTicketResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case RemoveTicketErrors.OccurrenceDoesntExists:
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
