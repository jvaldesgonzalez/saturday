import { IRepository } from 'src/shared/core/interfaces/IRepository';
import {
  BaseNotification,
  NotificationEventData,
  NotificationUserData,
} from '../../domain/notification.domain';

export interface INotificationsRepository
  extends IRepository<BaseNotification> {
  getNotificationData(
    theEventId?: string,
    theUserId?: string,
  ): Promise<{
    userData?: NotificationUserData;
    eventData?: NotificationEventData;
  }>;
}
