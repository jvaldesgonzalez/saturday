import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Ticket } from 'src/modules/events/domain/entities/ticket.entity';
import { TicketAmount } from 'src/modules/events/domain/value-objects/ticket-amount.value';
import { TicketPrice } from 'src/modules/events/domain/value-objects/ticket-price.value';
import { IEventOccurrenceRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventOccurrenceRepository';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AddTicketDto } from '../../dtos/addTicket.dto';
import { AddTicketErrors } from './add-ticket.errors';

type AddTicketUseCaseResponse = Either<
  | AppError.UnexpectedError
  | AddTicketErrors.OccurrenceDoesntExist
  | Result<any>,
  Result<void>
>;

@Injectable()
export class AddTicketUseCase
  implements IUseCase<AddTicketDto, AddTicketUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IEventOccurrenceRepository')
    private _eventOccurrenceRepository: IEventOccurrenceRepository,
  ) {
    this._logger = new Logger('AddTicketUseCase');
  }
  async execute(request: AddTicketDto): Promise<AddTicketUseCaseResponse> {
    this._logger.log('Executing...');
    try {
      const occurrence = await this._eventOccurrenceRepository.findById(
        request.occurrenceId,
      );
      if (!occurrence)
        return left(
          new AddTicketErrors.OccurrenceDoesntExist(request.occurrenceId),
        );

      const amountOrError = TicketAmount.create(request.amount);
      const priceOrError = TicketPrice.create(request.price);

      const combined = Result.combine([amountOrError, priceOrError]);

      if (combined.isFailure) return left(Fail<Ticket>(combined.error));
      const ticketOrError = Ticket.new({
        ...request,
        amount: amountOrError.getValue(),
        price: priceOrError.getValue(),
      });

      if (ticketOrError.isFailure)
        return left(Fail<Ticket>(ticketOrError.error.toString()));

      occurrence.addTicket(ticketOrError.getValue());
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
