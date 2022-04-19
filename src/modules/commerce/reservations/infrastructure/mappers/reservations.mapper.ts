import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import {
  makeDate,
  parseDate,
} from 'src/shared/modules/data-access/neo4j/utils';
import { Reservation } from '../../domain/reservation.domain';
import { ReservationEntity } from '../entities/reservation.entity';

export namespace ReservationMapper {
  export function toPersistence(domain: Reservation): ReservationEntity {
    return {
      id: domain._id.toString(),
      createdAt: makeDate(domain.createdAt),
      updatedAt: makeDate(domain.updatedAt),
      ticketId: domain.ticketId.toString(),
      ticketName: domain.ticketName,
      ticketPrice: domain.ticketPrice,
      ticketDescription: domain.ticketDescription,
      couponId: domain.couponId ? domain.couponId.toString() : null,
      amountOfTickets: domain.amountOfTickets,
      issuerId: domain.issuerId,
      securityPhrase: domain.securityPhrase,
      isValidated: domain.isValidated,
    };
  }

  export function fromPersistence(p: ReservationEntity): Reservation {
    console.log(p);
    return Reservation.create(
      {
        ...p,
        createdAt: parseDate(p.createdAt),
        updatedAt: parseDate(p.updatedAt),
        couponId: p.couponId && new UniqueEntityID(p.couponId),
        ticketId: new UniqueEntityID(p.ticketId),
        issuerId: new UniqueEntityID(p.issuerId),
        securityPhrase: p.securityPhrase,
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }
}
