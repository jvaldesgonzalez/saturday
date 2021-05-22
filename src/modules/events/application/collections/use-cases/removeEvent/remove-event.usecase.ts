import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EventRef } from 'src/modules/events/domain/entities/eventRef.entity';
import { ICollectionRepository } from 'src/modules/events/infrascruture/repositories/interfaces/ICollectionRepository';
import { IEventRepository } from 'src/modules/events/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { AddEventDto } from '../../dto/add-event.dto';
import { RemoveEventDto } from '../../dto/remove-event.dto';
import { RemoveEventErrors } from './remove-event.errors';

type RemoveEventUseCaseResponse = Either<
  | AppError.UnexpectedError
  | RemoveEventErrors.CollectionNotFound
  | RemoveEventErrors.EventNotFound
  | Result<any>,
  Result<void>
>;

@Injectable()
export class RemoveEventUseCase
  implements IUseCase<RemoveEventDto, RemoveEventUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('ICollectionRepository')
    private _collectionRepo: ICollectionRepository,
    @Inject('IEventRepository') private _eventRepo: IEventRepository,
  ) {
    this._logger = new Logger('AddEventUseCase');
  }
  async execute(request: AddEventDto): Promise<RemoveEventUseCaseResponse> {
    const [collection, eventExists] = await Promise.all([
      this._collectionRepo.findById(request.collectionId),
      this._eventRepo.exists(request.eventId),
    ]);
    if (!collection)
      return left(
        new RemoveEventErrors.CollectionNotFound(request.collectionId),
      );
    if (!eventExists)
      return left(new RemoveEventErrors.EventNotFound(request.eventId));

    collection.deleteEvent(EventRef.create(request.eventId).getValue());
    await this._collectionRepo.save(collection);
    return right(Ok());
  }
}
