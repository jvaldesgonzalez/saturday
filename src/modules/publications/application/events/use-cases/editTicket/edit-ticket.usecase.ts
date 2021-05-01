import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Event } from 'src/modules/publications/domain/entities/event.entity';
import { TicketAmount } from 'src/modules/publications/domain/value-objects/ticket-amount.value';
import { TicketPrice } from 'src/modules/publications/domain/value-objects/ticket-price.value';
import { IEventRepository } from 'src/modules/publications/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { EditTicketDto } from '../../dtos/editTicket.dto';
import { EditTicketErrors } from './edit-ticket.errors';

type EditTicketUseCaseResponse = Either<
  | AppError.UnexpectedError
  | EditTicketErrors.EventDoestnExists
  | EditTicketErrors.OccurrenceDoesntExistInEvent
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
    @Inject('IUnitOfWorkFactory') private _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private _repositoryFact: IRepositoryFactory<Event, IEventRepository>,
  ) {
    this.changes = new Changes();
    this._logger = new Logger('EditTicketUseCase');
  }
  async execute(request: EditTicketDto): Promise<EditTicketUseCaseResponse> {
    try {
      const uow = this._unitOfWorkFact.build();
      await uow.start();
      const repo = uow.getRepository(this._repositoryFact);
      return await uow.commit(() => this.work(request, repo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: EditTicketDto,
    repo: IEventRepository,
  ): Promise<EditTicketUseCaseResponse> {
    const event = await repo.findById(request.eventId);
    if (!event)
      return left(new EditTicketErrors.EventDoestnExists(request.eventId));
    const occurrence = event.findOccurrenceById(request.occurrenceId);
    if (!occurrence)
      return left(
        new EditTicketErrors.OccurrenceDoesntExistInEvent(request.occurrenceId),
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
      await repo.save(event);
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
    return right(Ok());
  }
}
