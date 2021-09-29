import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { NotificationType } from '../enums/notification-type';
import { RecipientId } from './value-objects/recipient-id.value';

type NotificationProps = {
  recipientId: RecipientId;
  title: string;
  imageUrl: string;
  url: string;
  body: string;
  type: NotificationType;
  createdAt: Date;
  updatedAt: Date;
};

type NewNotificationProps = Omit<NotificationProps, 'createdAt' | 'updatedAt'>;
type OnlyRecipientProps = { recipientId: RecipientId };

export type FriendRequestNotificationProps = OnlyRecipientProps & {
  requesterId: string;
  requesterUsername: string;
  imageUrl: string; //Requester image (profile picture)
};

export type EventPublishedNotificationProps = OnlyRecipientProps & {
  eventId: string;
  eventName: string;

  partnerUsername: string;
  imageUrl: string; //Event image
};

export type EventSharedNotificationProps = OnlyRecipientProps & {
  eventId: string;
  eventName: string;
  senderUsername: string;
  imageUrl: string; //Event image
};

export class Notification extends DomainEntity<NotificationProps> {
  get recipientId(): RecipientId {
    return this.props.recipientId;
  }

  get title(): string {
    return this.props.title;
  }

  get url(): string | undefined {
    return this.props.title;
  }

  get body(): string {
    return this.props.body;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static forFriendRequest(
    props: FriendRequestNotificationProps,
  ): Result<Notification> {
    return Notification.new({
      ...props,
      type: NotificationType.FriendRequest,
      url: `/users/${props.requesterId}/profile/`,
      title: `Un tipo quiere conocerte`,
      body: `El tigre @${props.requesterUsername} ta loco por tallar contigo`,
    });
  }

  public static forEventPublished(
    props: EventPublishedNotificationProps,
  ): Result<Notification> {
    return Notification.new({
      ...props,
      type: NotificationType.EventPublished,
      url: `/events/${props.eventId}/`,
      title: `Evento publicado`,
      body: `El tigre @${props.partnerUsername} ha publicado un evento to gucci`,
    });
  }

  public static forEventShared(
    props: EventSharedNotificationProps,
  ): Result<Notification> {
    return Notification.new({
      ...props,
      type: NotificationType.EventPublished,
      url: `/events/${props.eventId}/`,
      title: `Evento compartido`,
      body: `El tigre @${props.senderUsername} te compartio un evento bacan`,
    });
  }

  private static new(props: NewNotificationProps): Result<Notification> {
    return Notification.create(
      { ...props, createdAt: new Date(), updatedAt: new Date() },
      new UniqueEntityID(),
    );
  }

  private static create(
    props: NotificationProps,
    id: UniqueEntityID,
  ): Result<Notification> {
    return Ok(new Notification(props, id));
  }
}
