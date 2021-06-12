import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { EventOccurrence } from 'src/modules/events/domain/entities/event-ocurrency.entity';
import { EventRef } from 'src/modules/events/domain/entities/eventRef.entity';
import {
  Ticket,
  TicketCollection,
} from 'src/modules/events/domain/entities/ticket.entity';
import { TicketAmount } from 'src/modules/events/domain/value-objects/ticket-amount.value';
import { TicketPrice } from 'src/modules/events/domain/value-objects/ticket-price.value';
import { IEventOccurrenceRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventOccurrenceRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
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
    @Inject('IEventOccurrenceRepository')
    private _occurrRepository: IEventOccurrenceRepository,
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

    const occurrence = occurrenceOrError.getValue();
    try {
      const eventOrNone = await this._occurrRepository.eventExists(
        occurrence.eventId._id.toString(),
      );
      if (!eventOrNone)
        return left(
          new AddOccurrenceErrors.EventDoestnExists(occurrence._id.toString()),
        );
      console.log(occurrence);
      await this._occurrRepository.save(occurrence);
      return right(Ok());
    } catch (err) {
      console.log(err);
      return left(new AppError.UnexpectedError());
    }
  }
}
