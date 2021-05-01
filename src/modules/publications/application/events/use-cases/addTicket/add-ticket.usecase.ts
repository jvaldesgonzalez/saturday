import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Event } from 'src/modules/publications/domain/entities/event.entity';
import { Ticket } from 'src/modules/publications/domain/entities/ticket.entity';
import { TicketAmount } from 'src/modules/publications/domain/value-objects/ticket-amount.value';
import { TicketPrice } from 'src/modules/publications/domain/value-objects/ticket-price.value';
import { IEventRepository } from 'src/modules/publications/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AddTicketDto } from '../../dtos/addTicket.dto';
import { AddTicketErrors } from './add-ticket.errors';

type AddTicketUseCaseResponse = Either<
  | AppError.UnexpectedError
  | AddTicketErrors.EventDoestnExists
  | AddTicketErrors.OccurrenceDoesntExistInEvent
  | Result<any>,
  Result<void>
>;

@Injectable()
export class AddTicketUseCase
  implements IUseCase<AddTicketDto, AddTicketUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory') private _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private _repositoryFact: IRepositoryFactory<Event, IEventRepository>,
  ) {
    this._logger = new Logger('AddTicketUseCase');
  }
  async execute(request: AddTicketDto): Promise<AddTicketUseCaseResponse> {
    this._logger.log('Executing...');
    try {
      const uow = this._unitOfWorkFact.build();
      await uow.start();
      const eventRepo = uow.getRepository(this._repositoryFact);
      return await uow.commit(() => this.work(request, eventRepo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: AddTicketDto,
    repo: IEventRepository,
  ): Promise<AddTicketUseCaseResponse> {
    try {
      const event = await repo.findById(request.eventId);

      if (!event)
        return left(new AddTicketErrors.EventDoestnExists(request.eventId));

      const occurrence = event.occurrences
        .getItems()
        .find((occ) => occ._id.toString() === request.occurrenceId);

      if (!occurrence)
        return left(
          new AddTicketErrors.OccurrenceDoesntExistInEvent(
            request.occurrenceId,
          ),
        );

      const amountOrError = TicketAmount.create(request.amount);
      const priceOrError = TicketPrice.create(request.price);

      const combined = Result.combine([amountOrError, priceOrError]);

      if (combined.isFailure) return left(Fail<Ticket>(combined.error));
      const ticketOrError = Ticket.new({
        ...request,
        amount: amountOrError.getValue(),
        price: priceOrError.getValue(),
      });

      if (ticketOrError.isFailure)
        return left(Fail<Ticket>(ticketOrError.error.toString()));

      occurrence.addTicket(ticketOrError.getValue());
      await repo.save(event);

      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
