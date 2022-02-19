import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import {
  BuyerMetadata,
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
  async getBuyerMetadata(
    theReservationId: UniqueEntityID,
  ): Promise<BuyerMetadata> {
    return await this.persistenceManager.getOne<BuyerMetadata>(
      QuerySpecification.withStatement(
        `
					MATCH (r:Reservation)--(u:User)
					WHERE r.id = $rId
					RETURN u{
						.username,
						.avatar,
						.fullname
					}
				`,
      ).bind({ rId: theReservationId.toString() }),
    );
  }
  async getBySecurityPhrase(
    theSecurityPhrase: string,
    theValidtorId: string,
    theEventId: string,
    theOccurrenceId: string,
  ): Promise<Reservation> {
    const reservationOrNone =
      await this.persistenceManager.maybeGetOne<Reservation>(
        QuerySpecification.withStatement(
          `
				MATCH (t:Ticket)--(p:Reservation)--(u:User),
						(t)--(o:EventOccurrence)--(e:Event)--(partner:Partner)
				WHERE p.securityPhrase = $pPhrase AND partner.id = $partnerId AND e.id = $eId AND o.id = $oId
				RETURN {
					ticketId:t.id,
					amountOfTickets:p.amountOfTickets,
					createdAt:p.createdAt,
					updatedAt:p.updatedAt,
					isValidated:p.isValidated,
					securityPhrase:p.securityPhrase,
					issuerId:u.id,
					id:p.id
				}
			`,
        )
          .bind({
            pPhrase: theSecurityPhrase,
            partnerId: theValidtorId,
            eId: theEventId,
            oId: theOccurrenceId,
          })
          .map(ReservationMapper.fromPersistence),
      );
    return reservationOrNone ? reservationOrNone : null;
  }

  async nReservationsInATime(
    theUser: UniqueEntityID,
    timeInHours = 24,
  ): Promise<number> {
    return await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `
				MATCH (u:User)--(r:Reservation)
				WHERE u.id = $uId AND r.createdAt > datetime() - duration({hours:$hours})
				RETURN count(r)
					`,
      ).bind({ uId: theUser.toString(), hours: timeInHours }),
    );
  }

  async theUserReserveForEvent(
    theUser: UniqueEntityID,
    theTicket: UniqueEntityID,
  ): Promise<boolean> {
    const theOtherReservationsOrNone =
      await this.persistenceManager.query<string>(
        QuerySpecification.withStatement(
          `
					MATCH (t:Ticket)--(e:EventOccurrence)
					MATCH (e)--(:Ticket)--(other:Reservation)--(u:User)
					WHERE u.id = $uId AND t.id = $tId
					return distinct other.id
				`,
        ).bind({ uId: theUser.toString(), tId: theTicket.toString() }),
      );
    return theOtherReservationsOrNone.length > 0 ? true : false;
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
				CALL apoc.lock.nodes([t])
				CALL apoc.atomic.subtract(t,"amount",$amount,1)
				YIELD oldValue, newValue
				RETURN newValue
			`,
      ).bind({ tId: theTicketId.toString(), amount }),
    )) + 1
      ? true
      : false;
  }

  private async refundAvailability(
    theTicketId: UniqueEntityID,
    amount: number,
  ): Promise<void> {
    await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `
				MATCH (t:Ticket)
				WHERE t.id = $tId
				CALL apoc.atomic.add(t,"amount",$amount,5)
				YIELD oldValue, newValue
				RETURN newValue
			`,
      ).bind({ tId: theTicketId.toString(), amount }),
    );
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
					isValidated:p.isValidated,
					issuerId:u.id,
					id:p.id
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
					MERGE (t)<-[:ON_TICKET]-(p:Reservation {id: $pId})<-[:MADE_PURCHASE]-(u)
					SET p += $data
			`,
      ).bind({ uId: issuerId, tId: ticketId, data, pId: data.id }),
    );
  }

  @Transactional()
  async drop(theReservation: Reservation): Promise<void> {
    await this.refundAvailability(
      new UniqueEntityID(theReservation.ticketId),
      theReservation.amountOfTickets,
    );
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
				MATCH (r:Reservation)
				WHERE r.id = $rId
				DETACH DELETE r
			`,
      ).bind({ rId: theReservation._id.toString() }),
    );
  }
}
