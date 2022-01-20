import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
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
    @InjectFirebaseAdmin() private firebaseAdmin: FirebaseAdmin,
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
  ): Promise<{
    userData?: NotificationUserData;
    eventData?: NotificationEventData;
  }> {
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
        ).bind({ eId: theUserId }),
      );
    }
    return { userData: userPromise, eventData: eventPromise };
  }

  @Transactional()
  async save(entity: BaseNotification): Promise<void> {
    const { body, title } = entity;
    const { recipientId, ...data } = NotificationsMapper.toPersistence(entity);
    console.log({ recipientId });
    const tokens = await this.persistenceManager.query<string>(
      QuerySpecification.withStatement(
        `
    CREATE (new:Notification) SET new += $data
		WITH new
    MATCH (u:Account) WHERE u.id IN $uId
    MERGE (u)-[:HAS_NOTIFICATION]->(new)
		RETURN u.firebasePushId
    `,
      ).bind({ uId: recipientId, data, nId: data.id }),
    );

    const message: MulticastMessage = {
      tokens: [tokens].flat(),
      data: {
        eventData: JSON.stringify(entity.eventData || null),
        userData: JSON.stringify(entity.userData || null),
        id: entity._id.toString(),
        type: data.type,
        createdAt: data.createdAt.toString(),
      },
      notification: { title, body },
    };
    try {
      const fails = await this.firebaseAdmin.messaging.sendMulticast(message);
      console.log({ fails });
    } catch (error) {
      console.log(error);
    }
  }
}
