import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { ReservationReadResponse } from './presentation/reservation-read';
import { ReservationReadMapper } from './read-model/mappers/reservations.read-mapper';

@Injectable()
export class ReservationsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getMyReservations(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<ReservationReadResponse>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<ReservationReadResponse>(
        QuerySpecification.withStatement(
          `
				MATCH (u:User)--(p:Reservation)--(t:Ticket)--(o:EventOccurrence)--(e:Event)--(pl:Place),
				(e)-[:PUBLISH_EVENT]-(c:Partner)
				WHERE u.id = $uId
				OPTIONAL MATCH (p)-[:HAS_COUPON]->(coupon:Coupon)
				RETURN DISTINCT {
					ticket:{
						name:t.name,
						id:t.id,
						description:t.description,
						price:t.price
					},
					userId:u.id,
					id:p.id,
					amountOfTickets:p.amountOfTickets,
					couponApplied:coupon{.code},
					toPay:p.amountOfTickets * t.price,
					isValidated:p.isValidated,
					securityPhrase:p.securityPhrase,
					event:{
						publisher:{
							name:c.businessName,
							avatar:c.avatar,
							id:c.id,
							username:c.username
						},
						place:{
							name:pl.name,
							latitude:pl.latitude,
							longitude:pl.longitude,
							address:pl.address
						},
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						multimedia:e.multimedia,
						id:e.id,
						name:e.name
					}
				} AS reservation
				ORDER BY reservation.event.dateTimeInit
			`,
        )
          .bind({
            uId: userId,
          })
          .skip(skip)
          .limit(limit)
          .map(ReservationReadMapper.toResponse)
          .transform(ReservationReadResponse),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
				MATCH (u:User)--(p:Reservation)
				WHERE u.id = $uId
				return count(p)
				`,
        ).bind({ uId: userId }),
      ),
    ]);
    return {
      items,
      pageSize: items.length,
      total,
      current: skip,
    };
  }

  async getReservationDetails(
    issuerId: string,
    purchaseId: string,
  ): Promise<ReservationReadResponse> {
    return await this.persistenceManager.maybeGetOne<ReservationReadResponse>(
      QuerySpecification.withStatement(
        `
				MATCH (u:User)--(p:Reservation)--(t:Ticket)--(o:EventOccurrence)--(e:Event)--(pl:Place),
				(e)-[:PUBLISH_EVENT]-(c:Partner)
				WHERE u.id = $uId AND p.id = $pId
				OPTIONAL MATCH (p)-[:HAS_COUPON]->(coupon:Coupon)
				RETURN {
					ticket:{
						name:t.name,
						id:t.id,
						description:t.description,
						price:t.price
					},
					userId:u.id,
					id:p.id,
					amountOfTickets:p.amountOfTickets,
					couponApplied:coupon{.code},
					toPay:p.amountOfTickets * t.price,
					isValidated:p.isValidated,
					securityPhrase:p.securityPhrase,
					event:{
						publisher:{
							name:c.businessName,
							avatar:c.avatar,
							id:c.id,
							username:c.username
						},
						place:{
							name:pl.name,
							latitude:pl.latitude,
							longitude:pl.longitude,
							address:pl.address
						},
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						multimedia:e.multimedia,
						id:e.id,
						name:e.name
					}
				} AS reservation`,
      )
        .bind({ pId: purchaseId, uId: issuerId })
        .map(ReservationReadMapper.toResponse),
    );
  }
}
