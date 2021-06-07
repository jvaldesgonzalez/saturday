import { Inject, Injectable, Logger } from '@nestjs/common';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { IEventRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { DeleteOccurrenceDto } from '../../dtos/delete-occurrence.dto';
import { DeleteOccurrenceErrors } from './delete-occurrence.errors';

type DeleteOccurrenceUseCaseResponse = Either<
  | AppError.UnexpectedError
  | DeleteOccurrenceErrors.EventDoestnExists
  | DeleteOccurrenceErrors.OccurrenceDoesntExistInEvent
  | Result<any>,
  Result<void>
>;

@Injectable()
export class DeleteOccurrenceUseCase
  implements IUseCase<DeleteOccurrenceDto, DeleteOccurrenceUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IRepositoryFactory')
    private _repositoryFact: IRepositoryFactory<Event, IEventRepository>,
    @Inject('IUnitOfWorkFactory')
    private _unitOfWorkFact: IUnitOfWorkFactory,
  ) {
    this._logger = new Logger('AddOccurrenceUseCase');
  }
  async execute(
    request: DeleteOccurrenceDto,
  ): Promise<DeleteOccurrenceUseCaseResponse> {
    try {
      const unitOfWork = this._unitOfWorkFact.build();
      await unitOfWork.start();
      const eventRepo = unitOfWork.getRepository(this._repositoryFact);
      return await unitOfWork.commit(() => this.work(request, eventRepo));
    } catch (err) {
      console.log(err);
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    req: DeleteOccurrenceDto,
    eventRepo: IEventRepository,
  ): Promise<DeleteOccurrenceUseCaseResponse> {
    const eventOrNone = await eventRepo.findById(req.eventId);
    if (!eventOrNone)
      return left(new DeleteOccurrenceErrors.EventDoestnExists(req.eventId));

    // const addResult = eventOrNone.deleteOccurrence(
    //   new UniqueEntityID(req.occurrenceId),
    // );
    // if (addResult.isFailure) return left(addResult);
    // await eventRepo.save(eventOrNone);
    return right(Ok());
  }
}
