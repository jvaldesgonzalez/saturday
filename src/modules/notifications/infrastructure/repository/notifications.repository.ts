import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { INotificationsRepository } from '../../application/interfaces/notifications.repository';
import { BaseNotification } from '../../domain/notification.domain';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationsMapper } from '../mappers/notifications.mapper';

@Injectable()
export class NotificationsRepository
  extends BaseRepository<BaseNotification, NotificationEntity>
  implements INotificationsRepository
{
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'Notifications',
      NotificationsMapper.toPersistence,
      'NotificationsRepository',
      persistenceManager,
    );
  }

  @Transactional()
  async save(entity: BaseNotification): Promise<void> {
    const { recipientId, ...data } = NotificationsMapper.toPersistence(entity);
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
					CREATE (new:Notification) SET new += $data
					UNION
					MATCH (u:Account) WHERE u.id IN $uId
					MATCH (new:Notification) WHERE new.id = $nId
					MERGE (u)-[:HAS_NOTIFICATION]->(new)
			`,
      ).bind({ uId: recipientId, data, nId: data.id }),
    );
  }
}
