import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { ReservationProviders } from '../../../providers/providers.enum';
import { ConfirmReservationDto } from '../../dtos/validate-reservation.dto';
import { IReservationsRepository } from '../../interfaces/payments.repository.interface';
import { ConfirmReservationErrors } from './confirm-reservation.errors';

type Response = Either<
  | ConfirmReservationErrors.ReservationNotFound
  | ConfirmReservationErrors.ReservationIsVerified
  | AppError.UnexpectedError,
  Result<void>
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
      );
      console.log({ reservationOrNone });
      if (!reservationOrNone)
        return left(
          new ConfirmReservationErrors.ReservationNotFound(thePhrase),
        );
      if (reservationOrNone.isValidated)
        return left(new ConfirmReservationErrors.ReservationIsVerified());

      reservationOrNone.validate();
      await this.repo.save(reservationOrNone);
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
