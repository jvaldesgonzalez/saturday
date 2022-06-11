import { Inject, Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Reservation } from '../../../domain/reservation.domain';
import { ReservationProviders } from '../../../providers/providers.enum';
import { CreateReservationDto } from '../../dtos/create-reservation.dto';
import { IReservationsRepository } from '../../interfaces/payments.repository.interface';
import { CreateReservationErrors } from './create-reservation.errors';

type Response = Either<
  | CreateReservationErrors.TicketNotFound
  | CreateReservationErrors.NotAvailableAmount
  | AppError.UnexpectedError,
  Result<{ reservationId: string }>
>;

@Injectable()
export class CreateReservation
  implements IUseCase<CreateReservationDto, Response>
{
  private logger: Logger;

  // The UoW pattern is necessary due to the transactional nature of the usecase
  // Ex: If we can't create the Reservation, then we can't take the availability
  constructor(
    @Inject(ReservationProviders.IReservationRepositoryFactory)
    private repoFact: IRepositoryFactory<Reservation, IReservationsRepository>,
    @Inject(ReservationProviders.IReservationUnitOfWorkFactory)
    private uowFact: IUnitOfWorkFactory,
  ) {
    this.logger = new Logger('CreateReservationUseCase');
  }

  async execute(request: CreateReservationDto): Promise<Response> {
    this.logger.log('Executing...');
    try {
      const uow = this.uowFact.build();
      await uow.start();
      const repo = uow.getRepository(this.repoFact);
      return uow.commit(() => this.work(request, repo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: CreateReservationDto,
    repo: IReservationsRepository,
  ): Promise<Response> {
    const ticketId = new UniqueEntityID(request.ticketId);
    const couponId = request.couponId && new UniqueEntityID(request.couponId);
    const issuerId = request.issuerId && new UniqueEntityID(request.issuerId);

    //you cannot reserve twice for the same event
    const [thereIsPreviousReservation, reservationsAttempted] =
      await Promise.all([
        repo.theUserReserveForEvent(issuerId, ticketId),
        repo.nReservationsInATime(issuerId),
      ]);

    if (thereIsPreviousReservation)
      return left(new CreateReservationErrors.CantReserveTwice());

    if (reservationsAttempted > 2)
      return left(
        new CreateReservationErrors.MaxReservationsAttempt(
          reservationsAttempted,
        ),
      );

    const couldFetchAvailability = await repo.fetchAvailability(
      ticketId,
      request.amountOfTickets,
    );
    if (!couldFetchAvailability)
      return left(
        new CreateReservationErrors.NotAvailableAmount(
          ticketId,
          request.amountOfTickets,
        ),
      );

    const ticketDataOrNone = await repo.getTicketMetadata(ticketId);
    if (!ticketDataOrNone)
      return left(new CreateReservationErrors.TicketNotFound(ticketId));

    const reservationOrError = Reservation.new({
      ...request,
      ticketName:
        process.env.PROMO === 'true'
          ? ticketDataOrNone.name + ' (-10%)'
          : ticketDataOrNone.name,
      ticketPrice:
        process.env.PROMO === 'true'
          ? parseFloat(
              (ticketDataOrNone.price - ticketDataOrNone.price / 10).toFixed(2),
            )
          : ticketDataOrNone.price,
      ticketDescription: ticketDataOrNone.description,
      ticketId,
      couponId,
      issuerId,
    });
    const reservation = reservationOrError.getValue();

    await repo.save(reservation);

    return right(Ok({ reservationId: reservation._id.toString() }));
  }
}
