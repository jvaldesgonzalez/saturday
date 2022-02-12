import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CreateEventDto } from '../../dtos/create-event.dto';
import { IEventRepository } from '../../interfaces/event.repository';
import { Event } from '../../../domain/event.domain';
import { EventProviders } from '../../../providers/event.providers.enum';
import { EventOccurrence } from '../../../domain/event-occurrence.domain';
import { OccurrenceTicket } from '../../../domain/occurrence-ticket.domain';

type Response = Either<AppError.UnexpectedError, Result<void>>;

@Injectable()
export class CreateEvent implements IUseCase<CreateEventDto, Response> {
  private _logger: Logger;
  constructor(
    @Inject(EventProviders.IEventRepository)
    private readonly _repository: IEventRepository,
  ) {
    this._logger = new Logger('CreateEventUseCase');
  }

  async execute(request: CreateEventDto): Promise<Response> {
    this._logger.log('Executing...');

    const publisher = new UniqueEntityID(request.publisher);
    const category = new UniqueEntityID(request.category);
    const collaborators = request.collaborators.map(
      (c) => new UniqueEntityID(c),
    );
    const event = Event.new({
      ...request,
      publisher,
      collaborators,
      category,
    }).getValue();

    request.newOccurrences.forEach((o) => {
      const occ = EventOccurrence.new({
        ...o,
        eventId: new UniqueEntityID(event._id.toString()),
        newTickets: o.newTickets
          .map((ticket) => OccurrenceTicket.new(ticket))
          .map((r) => r.getValue()),
      }).getValue();
      event.addOccurrence(occ);
    });

    try {
      this._logger.log(event);
      await this._repository.save(event);
      return right(Ok());
    } catch (error) {
      this._logger.error(error);
      return left(new AppError.UnexpectedError());
    }
  }
}
