import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { MyPurchases } from './presentation/my-purchases';

@Injectable()
export class PurchasesReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getMyPurchases(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<MyPurchases>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<MyPurchases>(
        QuerySpecification.withStatement(
          `
				MATCH (u:User)--(p:Purchase)--(t:Ticket)--(o:EventOccurrence)--(e:Event)--(pl:Place),
				(e)-[:PUBLISH_EVENT]-(c:Partner)
				WHERE u.id = $uId
				RETURN DISTINCT {
					ticket:{
						name:t.name,
						id:t.id,
						description:t.description,
						price:t.price
					},
					userId:u.id,
					id:p.id,
					transactionId:p.transactionId,
					dateTimePurchased:p.executedAt,
					amountOfTickets:p.amountOfTickets,
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
				} AS purchase
				ORDER BY purchase.event.dateTimeInit
			`,
        )
          .bind({
            uId: userId,
          })
          .skip(skip)
          .limit(limit)
          .map((r) => {
            return {
              ...r,
              dateTimePurchased: parseDate(r.dateTimePurchased),
              event: {
                ...r.event,
                dateTimeInit: parseDate(r.event.dateTimeInit),
                dateTimeEnd: parseDate(r.event.dateTimeEnd),
                multimedia: TextUtils.escapeAndParse(r.event.multimedia)[0],
                place: {
                  ...r.event.place,
                  latitude: r.event.place.latitude,
                  longitude: r.event.place.longitude,
                },
              },
            };
          })
          .transform(MyPurchases),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
				MATCH (u:User)--(p:Purchase)
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

  async getPurchaseDetail(
    issuerId: string,
    purchaseId: string,
  ): Promise<MyPurchases> {
    return await this.persistenceManager.maybeGetOne<MyPurchases>(
      QuerySpecification.withStatement(
        `
				MATCH (u:User)--(p:Purchase)--(t:Ticket)--(o:EventOccurrence)--(e:Event)--(pl:Place),
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
					transactionId:p.transactionId,
					gateway:p.gateway,
					dateTimePurchased:p.executedAt,
					amountOfTickets:p.amountOfTickets,
					couponApplied:{
						code: coupon.code
					},
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
				} AS purchase`,
      )
        .bind({ pId: purchaseId, uId: issuerId })
        .map((r) => {
          return {
            ...r,
            dateTimePurchased: parseDate(r.dateTimePurchased),
            event: {
              ...r.event,
              dateTimeInit: parseDate(r.event.dateTimeInit),
              dateTimeEnd: parseDate(r.event.dateTimeEnd),
              multimedia: TextUtils.escapeAndParse(r.event.multimedia)[0],
              place: {
                ...r.event.place,
                latitude: r.event.place.latitude,
                longitude: r.event.place.longitude,
              },
            },
          };
        }),
    );
  }
}
