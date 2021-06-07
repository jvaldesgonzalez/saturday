import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { EventOccurrence } from 'src/modules/events/domain/entities/event-ocurrency.entity';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { EventRef } from 'src/modules/events/domain/entities/eventRef.entity';
import {
  Ticket,
  TicketCollection,
} from 'src/modules/events/domain/entities/ticket.entity';
import { TicketAmount } from 'src/modules/events/domain/value-objects/ticket-amount.value';
import { TicketPrice } from 'src/modules/events/domain/value-objects/ticket-price.value';
import { IEventRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Join, Ok, Result } from 'src/shared/core/Result';
import { AddOccurrenceDto } from '../../dtos/add-occurrence.dto';
import { AddOccurrenceErrors } from './add-occurrence.errors';

type AddOccurrenceUseCaseResponse = Either<
  | AppError.UnexpectedError
  | AddOccurrenceErrors.EventDoestnExists
  | Result<any>,
  Result<void>
>;

@Injectable()
export class AddOccurrenceUseCase
  implements IUseCase<AddOccurrenceDto, AddOccurrenceUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IRepositoryFactory')
    private _repositoryFact: IRepositoryFactory<Event, IEventRepository>,
    @Inject('IUnitOfWorkFactory')
    private _unitOfWorkFact: IUnitOfWorkFactory,
  ) {
    this._logger = new Logger('AddOccurrenceUseCase');
  }
  async execute(
    request: AddOccurrenceDto,
  ): Promise<AddOccurrenceUseCaseResponse> {
    this._logger.log('Executing...');
    const ticketsOrError = Join(
      request.tickets.map((tkt) => {
        const amountOrError = TicketAmount.create(tkt.amount);
        const priceOrError = TicketPrice.create(tkt.price);

        const combined = Result.combine([amountOrError, priceOrError]);
        if (combined.isFailure) return Fail<Ticket>(combined.error);
        return Ticket.new({
          ...tkt,
          amount: amountOrError.getValue(),
          price: priceOrError.getValue(),
        });
      }),
    );

    if (ticketsOrError.isFailure)
      return left(Fail<EventOccurrence>(ticketsOrError.error.toString()));

    const occurrenceOrError = EventOccurrence.new({
      ...request,
      eventId: EventRef.create(request.eventId).getValue(),
      tickets: new TicketCollection(ticketsOrError.getValue()),
    });

    if (occurrenceOrError.isFailure)
      return left(Fail<EventOccurrence>(occurrenceOrError.error.toString()));

    try {
      const unitOfWork = this._unitOfWorkFact.build();
      await unitOfWork.start();
      const eventRepo = unitOfWork.getRepository(this._repositoryFact);
      return await unitOfWork.commit(() =>
        this.work(occurrenceOrError.getValue(), eventRepo),
      );
    } catch (err) {
      console.log(err);
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    occurrence: EventOccurrence,
    eventRepo: IEventRepository,
  ): Promise<AddOccurrenceUseCaseResponse> {
    const eventOrNone = await eventRepo.findById(occurrence._id.toString());
    if (!eventOrNone)
      return left(
        new AddOccurrenceErrors.EventDoestnExists(occurrence._id.toString()),
      );

    await eventRepo.save(eventOrNone);
    return right(Ok());
  }
}
