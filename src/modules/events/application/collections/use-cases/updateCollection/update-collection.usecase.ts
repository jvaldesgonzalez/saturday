import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ICollectionRepository } from 'src/modules/events/infrastruture/repositories/interfaces/ICollectionRepository';
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
    @Inject('ICollectionRepository')
    private _collectionRepo: ICollectionRepository,
  ) {
    this._logger = new Logger('UpdateCollectionUseCase');
    this.changes = new Changes();
  }

  async execute(
    request: UpdateCollectionDto,
  ): Promise<UpdateCollectionUseCaseResponse> {
    const collection = await this._collectionRepo.findById(
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

    await this._collectionRepo.save(collection);
    return right(Ok());
  }
}
