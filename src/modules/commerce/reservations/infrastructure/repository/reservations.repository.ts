import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import {
  IReservationsRepository,
  TicketWithMetadata,
} from '../../application/interfaces/payments.repository.interface';
import { Reservation } from '../../domain/reservation.domain';
import { ReservationEntity } from '../entities/reservation.entity';
import { ReservationMapper } from '../mappers/reservations.mapper';

export class ReservationsRepository
  extends BaseRepository<Reservation, ReservationEntity>
  implements IReservationsRepository
{
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'Reservation',
      ReservationMapper.toPersistence,
      'ReservationsRepository',
      persistenceManager,
    );
  }

  async fetchAvailability(
    theTicketId: UniqueEntityID,
    amount: number,
  ): Promise<boolean> {
    return (await this.persistenceManager.maybeGetOne<number>(
      QuerySpecification.withStatement(
        `
				MATCH (t:Ticket)
				WHERE t.id = $tId AND t.amount >= $amount
				CALL apoc.atomic.subtract(t,"amount",$amount,5)
				YIELD oldValue, newValue
				RETURN newValue
			`,
      ).bind({ tId: theTicketId.toString(), amount }),
    ))
      ? true
      : false;
  }

  async getTicketMetadata(
    theTicketId: UniqueEntityID,
  ): Promise<TicketWithMetadata> {
    return await this.persistenceManager.maybeGetOne<TicketWithMetadata>(
      QuerySpecification.withStatement(
        `
				MATCH (t:Ticket)--(o:EventOccurrence)--(e:Event)
				WHERE t.id = $tId
				WITH t,e.id as eId, e.name as eName
				RETURN {
					name:t.name,
					description:t.description,
					price:t.price,
					eventName:eName
				}
			`,
      ).bind({ tId: theTicketId.toString() }),
    );
  }

  async getById(theReservationId: UniqueEntityID): Promise<Reservation> {
    const rawReservation =
      await this.persistenceManager.maybeGetOne<ReservationEntity>(
        QuerySpecification.withStatement(
          `
				MATCH (t:Ticket)--(p:Reservation)--(u:User)
				WHERE p.id = $pId
				RETURN {
					ticketId:t.id,
					amountOfTickets:p.amountOfTickets,
					createdAt:p.createdAt,
					updatedAt:p.updatedAt,
					securityPhrase:p.securityPhrase,
					issuerId:u.id
				}
			`,
        ).bind({ pId: theReservationId.toString() }),
      );
    return rawReservation
      ? ReservationMapper.fromPersistence(rawReservation)
      : null;
  }

  @Transactional()
  async save(theReservation: Reservation): Promise<void> {
    const rawReservation = ReservationMapper.toPersistence(theReservation);
    const { ticketId, issuerId, ...data } = rawReservation;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
					MATCH (t:Ticket)
					WHERE t.id = $tId
					MATCH (u:User)
					WHERE u.id = $uId
					CREATE (t)<-[:ON_TICKET]-(p:Reservation)<-[:MADE_PURCHASE]-(u)
					SET p += $data
			`,
      ).bind({ uId: issuerId, tId: ticketId, data }),
    );
  }
}
