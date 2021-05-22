import { Inject, Injectable, Logger } from '@nestjs/common';
import { AttentionTag } from 'src/modules/events/domain/entities/attention-tag.entity';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { IEventRepository } from 'src/modules/events/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AddAttentionTagDto } from '../../dtos/add-attention-tag.dto';
import { AddTagErrors } from './add-tag.errors';

type AddTagUseCaseResponse = Either<
  AppError.UnexpectedError | AddTagErrors.EventDoestnExists | Result<any>,
  Result<void>
>;

@Injectable()
export class AddTagUseCase
  implements IUseCase<AddAttentionTagDto, AddTagUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory') private _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private _repositoryFact: IRepositoryFactory<Event, IEventRepository>,
  ) {
    this._logger = new Logger('AddTagUseCase');
  }
  async execute(request: AddAttentionTagDto): Promise<AddTagUseCaseResponse> {
    try {
      const uow = this._unitOfWorkFact.build();
      await uow.start();
      const repo = uow.getRepository(this._repositoryFact);
      return await uow.commit(() => this.work(request, repo));
    } catch (error) {
      left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: AddAttentionTagDto,
    repo: IEventRepository,
  ): Promise<AddTagUseCaseResponse> {
    const event = await repo.findById(request.eventId);
    if (!event)
      return left(new AddTagErrors.EventDoestnExists(request.eventId));
    const tag = AttentionTag.create(request.tag);
    if (tag.isFailure) return left(Fail(tag.error.toString()));
    event.addTag(tag.getValue());
    try {
      await repo.save(event);
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
