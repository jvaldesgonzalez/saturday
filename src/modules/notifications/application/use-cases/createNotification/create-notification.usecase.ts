import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  BaseNotification,
  EventPublishedNotification,
  EventSharedNotification,
  FriendRequestNotification,
  NewFriendNotification,
} from 'src/modules/notifications/domain/notification.domain';
import { NotificationType } from 'src/modules/notifications/enums/notification-type';
import { NotificationsRepository } from 'src/modules/notifications/infrastructure/repository/notifications.repository';
import { Either, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CreateNotificationDto } from '../../dtos/create-notification.dto';

type Response = Either<
  AppError.UnexpectedError | AppError.ValidationError,
  Result<void>
>;

@Injectable()
export class CreateNotification
  implements IUseCase<CreateNotificationDto, Response>
{
  private _logger: Logger;
  constructor(private repo: NotificationsRepository) {
    this._logger = new Logger('CreateNotificationUseCase');
  }

  async execute(request: CreateNotificationDto): Promise<Response> {
    this._logger.log('Executing...');
    const notificationData = await this.repo.getNotificationData(
      request.eventId,
      request.userId,
    );

    let notification: BaseNotification;

    switch (request.type) {
      case NotificationType.NewFriend:
        notification = NewFriendNotification.create(
          {
            ...notificationData,
            recipientId: request.recipientId.map((i) => new UniqueEntityID(i)),
          },
          new UniqueEntityID(),
        ).getValue();
        break;
      case NotificationType.FriendRequest:
        notification = FriendRequestNotification.create(
          {
            ...notificationData,
            recipientId: request.recipientId.map((i) => new UniqueEntityID(i)),
          },
          new UniqueEntityID(),
        ).getValue();
        break;
      case NotificationType.EventShared:
        notification = EventSharedNotification.create(
          {
            ...notificationData,
            recipientId: request.recipientId.map((i) => new UniqueEntityID(i)),
          },
          new UniqueEntityID(),
        ).getValue();
        break;
      case NotificationType.EventPublished:
        notification = EventPublishedNotification.create(
          {
            ...notificationData,
            recipientId: request.recipientId.map((i) => new UniqueEntityID(i)),
          },
          new UniqueEntityID(),
        ).getValue();
        break;
    }

    console.log(notification);

    await this.repo.save(notification);

    return right(Ok());
  }
}
