import { Inject, Injectable } from '@nestjs/common';
import { Either } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Result } from 'src/shared/core/Result';
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
    throw new Error('NotImplementedException');
  }
}
