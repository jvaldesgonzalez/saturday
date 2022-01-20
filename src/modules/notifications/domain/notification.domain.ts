import { Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { NotificationType } from '../enums/notification-type';
import { RecipientId } from './value-objects/recipient-id.value';

export type NotificationEventData = {
  name: string;
  id: string;
  imageUrl: string;
};

export type NotificationUserData = {
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
  viewed: boolean;
};

type NewNotificationProps = Omit<
  NotificationProps,
  'createdAt' | 'updatedAt' | 'viewed'
>;

export abstract class BaseNotification extends AggregateDomainEntity<NotificationProps> {
  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get viewed(): boolean {
    return this.props.viewed;
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

  abstract get title(): string;

  abstract get body(): string;
}

export class NewFriendNotification extends BaseNotification {
  get title(): string {
    return 'Nuevo amigo';
  }

  get body(): string {
    return `${this.props.userData.username} ha aceptado tu solicitud de amistad`;
  }

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
        {
          ...props,
          createdAt: new Date(),
          updatedAt: new Date(),
          viewed: false,
        },
        id,
      ),
    );
  }
}

export class FriendRequestNotification extends BaseNotification {
  get title(): string {
    return 'Nueva solicitud de amistad';
  }

  get body(): string {
    return `${this.props.userData.username} te ha enviado una solicitud de amistad`;
  }
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
        {
          ...props,
          createdAt: new Date(),
          updatedAt: new Date(),
          viewed: false,
        },
        id,
      ),
    );
  }
}

export class EventSharedNotification extends BaseNotification {
  get title(): string {
    return 'Evento Compartido';
  }

  get body(): string {
    return `${this.props.userData.username} quiere que veas el evento ${this.props.eventData.name}.`;
  }
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
        {
          ...props,
          createdAt: new Date(),
          updatedAt: new Date(),
          viewed: false,
        },
        id,
      ),
    );
  }
}

export class EventPublishedNotification extends BaseNotification {
  get title(): string {
    return 'Nuevo evento';
  }

  get body(): string {
    return `${this.props.userData.username} ha publicado un nuevo evento: ${this.props.eventData.name}.`;
  }
  get type(): NotificationType {
    return NotificationType.EventPublished;
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
  ): Result<EventPublishedNotification> {
    return Ok(
      new EventPublishedNotification(
        {
          ...props,
          createdAt: new Date(),
          updatedAt: new Date(),
          viewed: false,
        },
        id,
      ),
    );
  }
}
