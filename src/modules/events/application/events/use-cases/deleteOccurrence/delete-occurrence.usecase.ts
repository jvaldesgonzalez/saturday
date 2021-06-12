import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventOccurrenceRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventOccurrenceRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { DeleteOccurrenceDto } from '../../dtos/delete-occurrence.dto';
import { DeleteOccurrenceErrors } from './delete-occurrence.errors';

type DeleteOccurrenceUseCaseResponse = Either<
  | AppError.UnexpectedError
  | DeleteOccurrenceErrors.OccurrenceDoesntExist
  | Result<any>,
  Result<void>
>;

@Injectable()
export class DeleteOccurrenceUseCase
  implements IUseCase<DeleteOccurrenceDto, DeleteOccurrenceUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IEventOccurrenceRepository')
    private _occurrenceRepository: IEventOccurrenceRepository,
  ) {
    this._logger = new Logger('AddOccurrenceUseCase');
  }
  async execute(
    request: DeleteOccurrenceDto,
  ): Promise<DeleteOccurrenceUseCaseResponse> {
    try {
      const occurrence = await this._occurrenceRepository.findById(
        request.occurrenceId,
      );
      if (!occurrence)
        return left(
          new DeleteOccurrenceErrors.OccurrenceDoesntExist(
            request.occurrenceId,
          ),
        );
      await this._occurrenceRepository.drop(occurrence);
      return right(Ok());
    } catch (err) {
      console.log(err);
      return left(new AppError.UnexpectedError());
    }
  }
}
