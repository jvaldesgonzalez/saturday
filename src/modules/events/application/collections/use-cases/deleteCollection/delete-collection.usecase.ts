import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Collection } from 'src/modules/events/domain/entities/collection.entity';
import { IEventRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { DeleteCollectionDto } from '../../dto/delete-collection.dto';
import { DeleteCollectionErrors } from './delete-collection.errors';

type DeleteCollectionUseCaseResponse = Either<
  | AppError.UnexpectedError
  | DeleteCollectionErrors.CollectionNotFound
  | Result<any>,
  Result<void>
>;

@Injectable()
export class DeleteCollectionUseCase
  implements IUseCase<DeleteCollectionDto, DeleteCollectionUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IEventRepository')
    private _eventRepository: IEventRepository,
  ) {
    this._logger = new Logger('DeleteCollectionUseCase');
  }

  async execute(
    request: DeleteCollectionDto,
  ): Promise<DeleteCollectionUseCaseResponse> {
    const collection: Collection = await this._eventRepository.findCollectionById(
      request.collectionId,
    );
    if (!collection)
      return left(
        new DeleteCollectionErrors.CollectionNotFound(request.collectionId),
      );

    collection.markDeleted();
    await this._eventRepository.dropCollection(collection);
    return right(Ok());
  }
}
