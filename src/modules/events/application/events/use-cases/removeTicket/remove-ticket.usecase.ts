import { Inject, Injectable, Logger } from '@nestjs/common';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { IEventRepository } from 'src/modules/events/infrascruture/repositories/interfaces/IEventRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { RemoveTicketDto } from '../../dtos/remove-ticket.dto';
import { RemoveTicketErrors } from './remove-ticket.errors';

type RemoveTicketUseCaseResponse = Either<
  | AppError.UnexpectedError
  | RemoveTicketErrors.EventDoestnExists
  | RemoveTicketErrors.OccurrenceDoesntExistInEvent
  | Result<any>,
  Result<void>
>;

@Injectable()
export class RemoveTicketUseCase
  implements IUseCase<RemoveTicketDto, RemoveTicketUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IUnitOfWorkFactory') private _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryFactory')
    private _repositoryFact: IRepositoryFactory<Event, IEventRepository>,
  ) {
    this._logger = new Logger();
  }
  async execute(
    request: RemoveTicketDto,
  ): Promise<RemoveTicketUseCaseResponse> {
    this._logger.log('Executing...');

    try {
      const uow = this._unitOfWorkFact.build();
      await uow.start();
      const repo = uow.getRepository(this._repositoryFact);
      return await uow.commit(() => this.work(request, repo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: RemoveTicketDto,
    repo: IEventRepository,
  ): Promise<RemoveTicketUseCaseResponse> {
    const event = await repo.findById(request.eventId);
    if (!event)
      return left(new RemoveTicketErrors.EventDoestnExists(request.eventId));
    const occurrence = event.findOccurrenceById(request.occurrenceId);
    if (!occurrence)
      return left(
        new RemoveTicketErrors.OccurrenceDoesntExistInEvent(
          request.occurrenceId,
        ),
      );
    const ticket = occurrence.findTicketById(request.ticketId);
    if (ticket) occurrence.removeTicket(ticket);
    return right(Ok());
  }
}
