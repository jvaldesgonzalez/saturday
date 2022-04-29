import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ReservationProviders } from '../../../providers/providers.enum';
import { ConfirmReservationDto } from '../../dtos/validate-reservation.dto';
import {
  IReservationsRepository,
  TicketWithMetadata,
} from '../../interfaces/payments.repository.interface';
import { ConfirmReservationErrors } from './confirm-reservation.errors';

type Response = Either<
  | ConfirmReservationErrors.ReservationNotFound
  | ConfirmReservationErrors.ReservationIsVerified
  | AppError.UnexpectedError,
  Result<TicketWithMetadata>
>;

@Injectable()
export class ConfirmReservation
  implements IUseCase<ConfirmReservationDto, Response>
{
  constructor(
    @Inject(ReservationProviders.IReservationsRepository)
    private repo: IReservationsRepository,
  ) {}
  async execute(request: ConfirmReservationDto): Promise<Response> {
    try {
      const thePhrase = request.securityPhrase;

      const reservationOrNone = await this.repo.getBySecurityPhrase(
        thePhrase,
        request.validatorId,
        request.eventId,
        request.occurrenceId,
      );
      if (!reservationOrNone)
        return left(
          new ConfirmReservationErrors.ReservationNotFound(thePhrase),
        );

      const userData = await this.repo.getBuyerMetadata(
        new UniqueEntityID(reservationOrNone._id.toString()),
      );

      const meta = await this.repo.getTicketMetadata(
        new UniqueEntityID(reservationOrNone.ticketId),
      );

      if (reservationOrNone.isValidated)
        return left(
          new ConfirmReservationErrors.ReservationIsVerified({
            ...meta,
            name: reservationOrNone.ticketName,
            price: reservationOrNone.ticketPrice,
            description: reservationOrNone.ticketDescription,
            amountOfTickets: reservationOrNone.amountOfTickets,
            user: userData,
            verifiedAt: reservationOrNone.updatedAt,
          }),
        );

      reservationOrNone.validate();
      await this.repo.save(reservationOrNone);
      return right(
        Ok({
          ...meta,
          name: reservationOrNone.ticketName,
          price: reservationOrNone.ticketPrice,
          description: reservationOrNone.ticketDescription,
          amountOfTickets: reservationOrNone.amountOfTickets,
          user: userData,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
