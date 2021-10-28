import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { NotificationResponse } from './presentation/notification';

@Injectable()
export class NotificationsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async findByRecipient(
    recipientId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<NotificationResponse>> {
    const items = await this.persistenceManager.query<NotificationResponse>(
      QuerySpecification.withStatement(
        `
				MATCH (u:Account)-[:NOTIFICATION]->(l:NOTIFICATION_LIST)-[:NEXT*${
          skip + 1
        }..${limit}]-(n:Notification)
				WHERE u.id = $recipientId
				RETURN n
				`,
      )
        .bind({ recipientId })
        .map((r) => {
          delete r.updatedAt;
          return {
            ...r,
            createdAt: parseDate(r.createdAt),
            eventData: TextUtils.escapeAndParse(r.eventData || null),
            userData: TextUtils.escapeAndParse(r.userData || null),
          };
        }),
    );
    return {
      items,
      total: 2,
      pageSize: items.length,
      current: skip,
    };
  }
}
