import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
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
  ): Promise<PaginatedFindResult<NotificationResponse> & { unviewed: number }> {
    const unviewed = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `
				MATCH (u:Account)-[relation:HAS_NOTIFICATION]-(n:Notification)
				WHERE u.id = $recipientId AND NOT relation.viewed = true
				RETURN count(n)
				`,
      ).bind({ recipientId }),
    );
    const [items, total] = await Promise.all([
      this.persistenceManager.query<NotificationResponse>(
        QuerySpecification.withStatement(
          `
				MATCH (u:Account)-[relation:HAS_NOTIFICATION]-(n:Notification)
				WHERE u.id = $recipientId
				WITH n,relation
				ORDER BY n.createdAt DESC
				RETURN apoc.map.merge(n, {viewed:relation.viewed})
				`,
        )
          .bind({
            recipientId,
          })
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

    //mark as viewed
    this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
				MATCH (u:Account)-[relation:HAS_NOTIFICATION]-(n:Notification)
				WITH n,relation
				SKIP $skip
				LIMIT $limit
				SET relation.viewed = true
				`,
      ).bind({
        recipientId,
        skip: Integer.fromInt(skip),
        limit: Integer.fromInt(limit),
      }),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
      unviewed,
    };
  }
}
