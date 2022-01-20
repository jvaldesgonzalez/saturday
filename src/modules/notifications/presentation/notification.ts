import { NotificationType } from '../enums/notification-type';

class NotificationEventData {
  name: string;
  id: string;
  imageUrl: string;
}

class NotificationUserData {
  username: string;
  id: string;
  imageUrl: string;
}

export class NotificationResponse {
  type: NotificationType;
  eventData?: NotificationEventData;
  userData?: NotificationUserData;
  createdAt: Date;
  viewed: boolean;
}
