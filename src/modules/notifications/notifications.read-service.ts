import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { NotificationsMapper } from './infrastructure/mappers/notifications.mapper';
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
    const [items, total] = await Promise.all([
      this.persistenceManager.query<NotificationResponse>(
        QuerySpecification.withStatement(
          `
				MATCH (u:Account)-[:HAS_NOTIFICATION]-(n:Notification)
				WHERE u.id = $recipientId
				RETURN n
				ORDER BY n.createdAt DESC
				`,
        )
          .bind({ recipientId })
          .skip(skip)
          .limit(limit)
          .map(NotificationsMapper.toResponse),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
				MATCH (u:Account)-[:HAS_NOTIFICATION]-(n:Notification)
				WHERE u.id = $recipientId
				RETURN count(n)
				`,
        ).bind({ recipientId }),
      ),
    ]);
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
}
