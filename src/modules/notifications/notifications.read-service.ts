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
				WHERE u.id = $recipientId AND (relation.viewed is null OR relation.viewed = false)
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
				RETURN apoc.map.merge(n, {viewed:relation.viewed})
				ORDER BY n.createdAt DESC
				SKIP $skip
				LIMIT $limit
				`,
        )
          .bind({
            recipientId,
            skip: Integer.fromInt(skip),
            limit: Integer.fromInt(limit),
          })
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
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
				MATCH (u:Account)-[relation:HAS_NOTIFICATION]-(n:Notification)
				WHERE u.id = $recipientId
				WITH relation,n
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
