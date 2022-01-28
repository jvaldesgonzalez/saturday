import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Reservation } from '../../domain/reservation.domain';

export interface TicketWithMetadata {
  name: string;
  description: string;
  price: number;
  eventName: string;
}

export interface IReservationsRepository extends IRepository<Reservation> {
  getTicketMetadata(theTicketId: UniqueEntityID): Promise<TicketWithMetadata>;
  fetchAvailability(
    theTicketId: UniqueEntityID,
    amount: number,
  ): Promise<boolean>;
  getById(theReservationId: UniqueEntityID): Promise<Reservation>;
  theUserReserveForEvent(
    theUser: UniqueEntityID,
    theTicket: UniqueEntityID,
  ): Promise<boolean>;
}
