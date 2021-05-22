import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EventRef } from 'src/modules/publications/domain/entities/eventRef.entity';
import { ICollectionRepository } from 'src/modules/publications/infrascruture/repositories/interfaces/ICollectionRepository';
import { IEventRepository } from 'src/modules/publications/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { AddEventDto } from '../../dto/add-event.dto';
import { AddEventErrors } from './add-event.errors';

type AddEventUseCaseResponse = Either<
  | AppError.UnexpectedError
  | AddEventErrors.CollectionNotFound
  | AddEventErrors.EventNotFound
  | Result<any>,
  Result<void>
>;

@Injectable()
export class AddEventUseCase
  implements IUseCase<AddEventDto, AddEventUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('ICollectionRepository')
    private _collectionRepo: ICollectionRepository,
    @Inject('IEventRepository') private _eventRepo: IEventRepository,
  ) {
    this._logger = new Logger('AddEventUseCase');
  }
  async execute(request: AddEventDto): Promise<AddEventUseCaseResponse> {
    const [collection, eventExists] = await Promise.all([
      this._collectionRepo.findById(request.collectionId),
      this._eventRepo.exists(request.eventId),
    ]);
    if (!collection)
      return left(new AddEventErrors.CollectionNotFound(request.collectionId));
    if (!eventExists)
      return left(new AddEventErrors.EventNotFound(request.eventId));

    collection.addEvent(EventRef.create(request.eventId).getValue());
    await this._collectionRepo.save(collection);
    return right(Ok());
  }
}
