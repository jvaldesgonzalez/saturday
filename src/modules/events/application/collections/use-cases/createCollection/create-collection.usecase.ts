import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Collection } from 'src/modules/events/domain/entities/collection.entity';
import {
  EventRef,
  EventRefCollection,
} from 'src/modules/events/domain/entities/eventRef.entity';
import { PublisherRef } from 'src/modules/events/domain/entities/publisherRef.entity';
import { ICollectionRepository } from 'src/modules/events/infrascruture/repositories/interfaces/ICollectionRepository';
import { IEventRepository } from 'src/modules/events/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Join, Ok, Result } from 'src/shared/core/Result';
import { CreateCollectionDto } from '../../dto/create-collection.dto';
import { CreateCollectionErrors } from './create-collection.errors';

type CreateCollectionUseCaseResponse = Either<
  | AppError.UnexpectedError
  | CreateCollectionErrors.AllEventMustExists
  | Result<any>,
  Result<void>
>;

@Injectable()
export class CreateCollectionUseCase
  implements IUseCase<CreateCollectionDto, CreateCollectionUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IEventRepository') private _eventRepo: IEventRepository,
    @Inject('ICollectionRepository')
    private _collectionRepository: ICollectionRepository,
  ) {
    this._logger = new Logger('CreateCollectionUseCase');
  }
  async execute(
    request: CreateCollectionDto,
  ): Promise<CreateCollectionUseCaseResponse> {
    this._logger.log('Executing...');

    const existsEvents = await Promise.all(
      request.eventsId.map((id) => this._eventRepo.exists(id)),
    );
    if (!existsEvents.every((e) => e))
      return left(new CreateCollectionErrors.AllEventMustExists());

    const eventsIdOrError = Join(
      request.eventsId.map((id) => EventRef.create(id)),
    );
    const publisherOrError = PublisherRef.create(request.publisher);

    const combinedResult = Result.combine([publisherOrError, eventsIdOrError]);
    if (combinedResult.isFailure)
      return left(Fail(eventsIdOrError.error.toString()));

    const collectionOrError = Collection.new({
      events: new EventRefCollection(eventsIdOrError.getValue()),
      name: request.name,
      description: request.description,
      publisher: publisherOrError.getValue(),
    });

    if (collectionOrError.isFailure)
      return left(Fail(collectionOrError.error.toString()));

    const collection = collectionOrError.getValue();
    await this._collectionRepository.save(collection);
    return right(Ok());
  }
}
