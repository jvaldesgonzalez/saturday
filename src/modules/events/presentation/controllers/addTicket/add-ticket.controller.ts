import { Injectable } from '@nestjs/common';
import { AddTicketErrors } from 'src/modules/events/application/events/use-cases/addTicket/add-ticket.errors';
import { AddTicketUseCase } from 'src/modules/events/application/events/use-cases/addTicket/add-ticket.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { AddTicketRequest } from './request';
import { AddTicketResponse } from './response';

@Injectable()
export class AddTicketController extends BaseController<
  AddTicketRequest,
  AddTicketResponse
> {
  constructor(private useCase: AddTicketUseCase) {
    super('CreateEventController');
  }
  protected async executeImpl(
    req: AddTicketRequest,
  ): Promise<AddTicketResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case AddTicketErrors.OccurrenceDoesntExist:
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
