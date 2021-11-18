import { DateTime } from 'neo4j-driver-core';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import {
  BaseNotification,
  EventPublishedNotification,
  EventSharedNotification,
  FriendRequestNotification,
  NewFriendNotification,
} from '../../domain/notification.domain';
import { NotificationType } from '../../enums/notification-type';
import { NotificationEntity } from '../entities/notification.entity';

export namespace NotificationsMapper {
  export function toPersistence(d: BaseNotification): NotificationEntity {
    const entityWithNuls: NotificationEntity = {
      recipientId: d.recipientId.map((r) => r.toString()),
      createdAt: DateTime.fromStandardDate(d.createdAt),
      updatedAt: DateTime.fromStandardDate(d.updatedAt),
      id: d._id.toString(),
      type: d.type,
      eventData: d.eventData ? JSON.stringify(d.eventData) : null,
      userData: d.userData ? JSON.stringify(d.userData) : null,
    };

    if (!entityWithNuls.userData) delete entityWithNuls.userData;
    if (!entityWithNuls.eventData) delete entityWithNuls.eventData;
    return entityWithNuls;
  }

  export function fromPersistence(db: NotificationEntity): BaseNotification {
    const [data, id] = [
      {
        ...db,
        createdAt: parseDate(db.createdAt),
        updatedAt: parseDate(db.updatedAt),
        recipientId: db.recipientId.map((id) => new UniqueEntityID(id)),
        eventData: TextUtils.escapeAndParse(
          db.eventData,
        ) as BaseNotification['eventData'],
        userData: TextUtils.escapeAndParse(
          db.userData,
        ) as BaseNotification['userData'],
      },
      new UniqueEntityID(db.id),
    ];
    switch (db.type) {
      case NotificationType.NewFriend:
        return NewFriendNotification.create(data, id).getValue();
      case NotificationType.FriendRequest:
        return FriendRequestNotification.create(data, id).getValue();
      case NotificationType.EventShared:
        return EventSharedNotification.create(data, id).getValue();
      case NotificationType.EventPublished:
        return EventPublishedNotification.create(data, id).getValue();
    }
  }

  export function toResponse(db: NotificationEntity) {
    const withNull = {
      id: db.id,
      userData: db.userData ? TextUtils.escapeAndParse(db.userData) : null,
      eventData: db.eventData ? TextUtils.escapeAndParse(db.eventData) : null,
      createdAt: parseDate(db.createdAt),
      type: db.type,
    };
    if (!withNull.eventData) delete withNull.eventData;
    if (!withNull.userData) delete withNull.userData;
    return withNull;
  }
}
