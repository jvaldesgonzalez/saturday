import { Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { NotificationType } from '../enums/notification-type';
import { RecipientId } from './value-objects/recipient-id.value';

type NotificationEventData = {
  name: string;
  id: string;
  imageUrl: string;
};

type NotificationUserData = {
  username: string;
  id: string;
  imageUrl: string;
};

type NotificationProps = {
  recipientId: RecipientId[];
  userData?: NotificationUserData;
  eventData?: NotificationEventData;
  createdAt: Date;
  updatedAt: Date;
};

type NewNotificationProps = Omit<NotificationProps, 'createdAt' | 'updatedAt'>;

export abstract class BaseNotification extends AggregateDomainEntity<NotificationProps> {
  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get recipientId(): RecipientId[] {
    return this.props.recipientId;
  }

  get userData(): NotificationUserData {
    return null;
  }

  get eventData(): NotificationEventData {
    return null;
  }

  abstract get type(): NotificationType;
}

export class NewFriendNotification extends BaseNotification {
  get type(): NotificationType {
    return NotificationType.NewFriend;
  }

  get userData() {
    return this.props.userData!;
  }

  public static create(
    props: NewNotificationProps,
    id: UniqueEntityID,
  ): Result<NewFriendNotification> {
    return Ok(
      new NewFriendNotification(
        { ...props, createdAt: new Date(), updatedAt: new Date() },
        id,
      ),
    );
  }
}

export class FriendRequestNotification extends BaseNotification {
  get type(): NotificationType {
    return NotificationType.FriendRequest;
  }

  get userData() {
    return this.props.userData!;
  }

  public static create(
    props: NewNotificationProps,
    id: UniqueEntityID,
  ): Result<FriendRequestNotification> {
    return Ok(
      new FriendRequestNotification(
        { ...props, createdAt: new Date(), updatedAt: new Date() },
        id,
      ),
    );
  }
}

export class EventSharedNotification extends BaseNotification {
  get type(): NotificationType {
    return NotificationType.EventShared;
  }

  get userData() {
    return this.props.userData!;
  }

  get eventData() {
    return this.props.eventData!;
  }

  public static create(
    props: NewNotificationProps,
    id: UniqueEntityID,
  ): Result<EventSharedNotification> {
    return Ok(
      new EventSharedNotification(
        { ...props, createdAt: new Date(), updatedAt: new Date() },
        id,
      ),
    );
  }
}
