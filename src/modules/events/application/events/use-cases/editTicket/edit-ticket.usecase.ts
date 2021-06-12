import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { TicketAmount } from 'src/modules/events/domain/value-objects/ticket-amount.value';
import { TicketPrice } from 'src/modules/events/domain/value-objects/ticket-price.value';
import { IEventOccurrenceRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventOccurrenceRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { EditTicketDto } from '../../dtos/editTicket.dto';
import { EditTicketErrors } from './edit-ticket.errors';

type EditTicketUseCaseResponse = Either<
  | AppError.UnexpectedError
  | EditTicketErrors.OccurrenceDoesntExists
  | EditTicketErrors.TicketDoestnExists
  | Result<any>,
  Result<void>
>;

@Injectable()
export class EditTicketUseCase
  implements IUseCase<EditTicketDto, EditTicketUseCaseResponse>, IWithChanges {
  private _logger: Logger;
  public changes: Changes;
  constructor(
    @Inject('IEventOccurrenceRepository')
    private _eventOccurrenceRepository: IEventOccurrenceRepository,
  ) {
    this.changes = new Changes();
    this._logger = new Logger('EditTicketUseCase');
  }
  async execute(request: EditTicketDto): Promise<EditTicketUseCaseResponse> {
    try {
      const occurrence = await this._eventOccurrenceRepository.findById(
        request.occurrenceId,
      );
      if (!occurrence)
        return left(
          new EditTicketErrors.OccurrenceDoesntExists(request.occurrenceId),
        );
      const ticket = occurrence.findTicketById(request.ticketId);

      if (request.ticket.amount) {
        const amountOrError = TicketAmount.create(request.ticket.amount);
        if (amountOrError.isFailure)
          return left(Fail(amountOrError.error.toString()));
        this.changes.addChange(ticket.changeAmount(amountOrError.getValue()));
      }

      if (request.ticket.description) {
        this.changes.addChange(
          ticket.changeDescription(request.ticket.description),
        );
      }

      if (request.ticket.name) {
        this.changes.addChange(ticket.changeName(request.ticket.name));
      }

      if (request.ticket.price) {
        const priceOrError = TicketPrice.create(request.ticket.price);
        if (priceOrError.isFailure)
          return left(Fail(priceOrError.error.toString()));
        this.changes.addChange(ticket.changePrice(priceOrError.getValue()));
      }

      if (this.changes.getChangeResult().isFailure)
        return left(Fail(this.changes.getChangeResult().error.toString()));

      try {
        await this._eventOccurrenceRepository.save(
          occurrence,
          request.expandToAll,
        );
      } catch (error) {
        return left(new AppError.UnexpectedError());
      }
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
