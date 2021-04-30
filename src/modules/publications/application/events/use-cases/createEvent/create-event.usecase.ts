import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import {
  CategoryRef,
  CategoryRefCollection,
} from 'src/modules/publications/domain/entities/categoryRef.entity';
import {
  EventOccurrence,
  EventOccurrenceCollection,
} from 'src/modules/publications/domain/entities/event-ocurrency.entity';
import { Event } from 'src/modules/publications/domain/entities/event.entity';
import { PublisherRef } from 'src/modules/publications/domain/entities/publisherRef.entity';
import {
  Ticket,
  TicketCollection,
} from 'src/modules/publications/domain/entities/ticket.entity';
import { EventName } from 'src/modules/publications/domain/value-objects/event-name.value';
import { EventPlace } from 'src/modules/publications/domain/value-objects/event-place.value';
import { TicketAmount } from 'src/modules/publications/domain/value-objects/ticket-amount.value';
import { TicketPrice } from 'src/modules/publications/domain/value-objects/ticket-price.value';
import { UnknownField } from 'src/modules/publications/domain/value-objects/unknown-field.value';
import { IEventRepository } from 'src/modules/publications/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Join, Ok, Result } from 'src/shared/core/Result';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CreateEventDto, OccurrenceRaw } from '../../dtos/create-event.dto';

export type CreateEventUseCaseResponse = Either<
  AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@Injectable()
export class CreateEventUseCase
  implements IUseCase<CreateEventDto, CreateEventUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IEventRepository') private readonly _repository: IEventRepository,
  ) {
    this._logger = new Logger('CreateEventUseCase');
  }

  async execute(request: CreateEventDto): Promise<CreateEventUseCaseResponse> {
    this._logger.log('Executing...');

    const publisherOrError = PublisherRef.create(request.publisher);
    const nameOrError = EventName.create(request.name);
    const unknownFieldsOrError = Join(
      request.description.map((uf) => UnknownField.create(uf)),
    );
    const categoriesOrError = Join(
      request.categories.map((ct) => CategoryRef.create(ct)),
    );
    const placeOrError = EventPlace.create({
      ...request.place,
      hostRef: new UniqueEntityID(request.place.hostRef),
    });
    const collaboratorsOrError = Join(
      request.collaborators.map((col) => PublisherRef.create(col)),
    );
    const multimediasOrError = Join(
      request.multimedia.map((mtm) => Multimedia.create(mtm)),
    );
    const occurrencesOrError = Join(
      request.occurrences.map((occur) => this.createOccurrencesFromRaw(occur)),
    );

    const combinedResult = Result.combine([
      publisherOrError,
      nameOrError,
      placeOrError,
      unknownFieldsOrError,
      categoriesOrError,
      collaboratorsOrError,
      multimediasOrError,
      occurrencesOrError,
    ]);

    if (combinedResult.isFailure) return left(Fail(combinedResult.error));

    const event = Event.new({
      publisher: publisherOrError.getValue(),
      name: nameOrError.getValue(),
      description: unknownFieldsOrError.getValue(),
      categories: new CategoryRefCollection(categoriesOrError.getValue()),
      place: placeOrError.getValue(),
      collaborators: collaboratorsOrError.getValue(),
      multimedia: multimediasOrError.getValue(),
      occurrences: new EventOccurrenceCollection(occurrencesOrError.getValue()),
    }).getValue();

    try {
      await this._repository.save(event);
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private createOccurrencesFromRaw(
    raw: OccurrenceRaw,
  ): Result<EventOccurrence> {
    const ticketsOrError = Join(
      raw.tickets.map((tkt) => {
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
      return Fail<EventOccurrence>(ticketsOrError.error.toString());

    return EventOccurrence.new({
      ...raw,
      tickets: new TicketCollection(ticketsOrError.getValue()),
    });
  }
}
