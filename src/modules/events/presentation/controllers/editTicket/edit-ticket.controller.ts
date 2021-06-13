import { Injectable } from '@nestjs/common';
import { EditTicketErrors } from 'src/modules/events/application/events/use-cases/editTicket/edit-ticket.errors';
import { EditTicketUseCase } from 'src/modules/events/application/events/use-cases/editTicket/edit-ticket.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { EditTicketRequest } from './request';
import { EditTicketResponse } from './response';

@Injectable()
export class EditTicketController extends BaseController<
  EditTicketRequest,
  EditTicketResponse
> {
  constructor(private useCase: EditTicketUseCase) {
    super('CreateEventController');
  }
  protected async executeImpl(
    req: EditTicketRequest,
  ): Promise<EditTicketResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EditTicketErrors.OccurrenceDoesntExists:
          this.notFound(error.errorValue().message);
        case EditTicketErrors.OccurrenceDoesntExists:
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
