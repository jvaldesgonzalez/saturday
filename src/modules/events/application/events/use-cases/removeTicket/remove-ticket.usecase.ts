import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventOccurrenceRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventOccurrenceRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { RemoveTicketDto } from '../../dtos/remove-ticket.dto';
import { RemoveTicketErrors } from './remove-ticket.errors';

type RemoveTicketUseCaseResponse = Either<
  | AppError.UnexpectedError
  | RemoveTicketErrors.OccurrenceDoesntExists
  | Result<any>,
  Result<void>
>;

@Injectable()
export class RemoveTicketUseCase
  implements IUseCase<RemoveTicketDto, RemoveTicketUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IEventOccurrenceRepository')
    private _eventOccurrenceRepository: IEventOccurrenceRepository,
  ) {
    this._logger = new Logger();
  }
  async execute(
    request: RemoveTicketDto,
  ): Promise<RemoveTicketUseCaseResponse> {
    this._logger.log('Executing...');

    try {
      const occurrence = await this._eventOccurrenceRepository.findById(
        request.occurrenceId,
      );
      if (!occurrence)
        return left(
          new RemoveTicketErrors.OccurrenceDoesntExists(request.occurrenceId),
        );
      const ticket = occurrence.findTicketById(request.ticketId);
      if (ticket) occurrence.removeTicket(ticket);
      await this._eventOccurrenceRepository.save(
        occurrence,
        request.expandToAll,
      );
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
