import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ReservationProviders } from '../../../providers/providers.enum';
import { CancelReservationDto } from '../../dtos/cancel-reservation.dto';
import { IReservationsRepository } from '../../interfaces/payments.repository.interface';
import { CancelReservationErrors } from './cancel-reservation.errors';

type Response = Either<
  CancelReservationErrors.ReservationNotFound | AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class CancelReservation
  implements IUseCase<CancelReservationDto, Response>
{
  constructor(
    @Inject(ReservationProviders.IReservationsRepository)
    private repo: IReservationsRepository,
  ) {}
  async execute(request: CancelReservationDto): Promise<Response> {
    try {
      const theReservationId = new UniqueEntityID(request.reservationId);
      const reservationOrNone = await this.repo.getById(theReservationId);
      console.log(reservationOrNone);
      if (!reservationOrNone || reservationOrNone.issuerId !== request.userId)
        return left(
          new CancelReservationErrors.ReservationNotFound(theReservationId),
        );
      await this.repo.drop(reservationOrNone);
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
