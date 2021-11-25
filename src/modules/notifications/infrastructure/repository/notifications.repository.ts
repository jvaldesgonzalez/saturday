import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { TextUtils } from 'src/shared/utils/text.utils';
import { INotificationsRepository } from '../../application/interfaces/notifications.repository';
import {
  BaseNotification,
  NotificationEventData,
  NotificationUserData,
} from '../../domain/notification.domain';
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
  async getNotificationData(
    theEventId?: string,
    theUserId?: string,
  ): Promise<{ user?: NotificationUserData; event?: NotificationEventData }> {
    let eventPromise: NotificationEventData;
    let userPromise: NotificationUserData;
    if (theEventId) {
      eventPromise =
        await this.persistenceManager.getOne<NotificationEventData>(
          QuerySpecification.withStatement(
            `
						MATCH (e:Event) WHERE e.id = $eId
						RETURN e{.name, .multimedia, .id}
				`,
          )
            .bind({ eId: theEventId })
            .map((r) => {
              return {
                name: r.name,
                id: r.id,
                imageUrl: TextUtils.escapeAndParse(r.multimedia)[0].url,
              };
            }),
        );
    }
    if (theUserId) {
      userPromise = await this.persistenceManager.getOne<NotificationUserData>(
        QuerySpecification.withStatement(
          `
						MATCH (e:User) WHERE e.id = $eId
						RETURN e{.username, .avatar, .id}
				`,
        ).bind({ eId: theEventId }),
      );
    }
    return { user: userPromise, event: eventPromise };
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
