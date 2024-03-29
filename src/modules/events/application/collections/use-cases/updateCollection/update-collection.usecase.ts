import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { IEventRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { Changes, IWithChanges } from 'src/shared/core/WithChanges';
import { UpdateCollectionDto } from '../../dto/update-collection.dto';
import { UpdateCollectionErrors } from './update-collection.errors';

export type UpdateCollectionUseCaseResponse = Either<
  | AppError.UnexpectedError
  | UpdateCollectionErrors.CollectionNotFound
  | Result<any>,
  Result<void>
>;

@Injectable()
export class UpdateCollectionUseCase
  implements
    IUseCase<UpdateCollectionDto, UpdateCollectionUseCaseResponse>,
    IWithChanges {
  private _logger: Logger;
  public changes: Changes;
  constructor(
    @Inject('IEventRepository')
    private _eventRepo: IEventRepository,
  ) {
    this._logger = new Logger('UpdateCollectionUseCase');
    this.changes = new Changes();
  }

  async execute(
    request: UpdateCollectionDto,
  ): Promise<UpdateCollectionUseCaseResponse> {
    this._logger.log('Excecuting...');
    const collection = await this._eventRepo.findCollectionById(
      request.collectionId,
    );
    if (!collection)
      return left(
        new UpdateCollectionErrors.CollectionNotFound(request.collectionId),
      );
    if (request.description)
      this.changes.addChange(collection.changeDescription(request.description));
    if (request.name)
      this.changes.addChange(collection.changeName(request.name));
    if (this.changes.getChangeResult().isFailure)
      return left(Fail(this.changes.getChangeResult().error.toString()));
    await this._eventRepo.saveCollection(collection);
    return right(Ok());
  }
}
