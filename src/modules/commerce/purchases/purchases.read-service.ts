import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
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
    const items = await this.persistenceManager.query<MyPurchases>(
      QuerySpecification.withStatement(
        `
				MATCH (u:User)--(p:Purchase)--(t:Ticket)--(o:EventOccurrence)--(e:Event)
				WHERE u.id = "8de83b51-04aa-42d8-861e-4289160694ef"
				RETURN {
					ticket:{
						name:t.name,
						id:t.id
						},
					amountOfTickets:p.amountOfTickets,
					event:{
						dateTimeInit:o.dateTimeInit,
						dateTimeEnd:o.dateTimeEnd,
						multimedia:e.multimedia,
						id:e.id,
						name:e.name
					}
				} AS purchase
				ORDER BY purchase.event.dateTimeInit
				SKIP $skip
				LIMIT $limit
			`,
      )
        .bind({
          uId: userId,
          limit: Integer.fromInt(limit),
          skip: Integer.fromInt(skip),
        })
        .map((r) => {
          return {
            ...r,
            event: {
              ...r.event,
              dateTimeInit: parseDate(r.event.dateTimeInit),
              dateTimeEnd: parseDate(r.event.dateTimeEnd),
              multimedia: JSON.parse(r.event.multimedia)[0],
            },
          };
        }),
    );
    return {
      items,
      pageSize: limit,
      total: 5,
      current: skip,
    };
  }
}
