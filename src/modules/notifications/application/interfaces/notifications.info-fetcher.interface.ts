import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export class NotificationEventInfo {
  name: string;
  imageUrl: string;
}

export class NotificationUserData {
  username: string;
  imageUrl: string;
}

export interface INotificationInfoFetcher {
  getEventInfo(eventId: UniqueEntityID): Promise<NotificationEventInfo>;
  getUserInfo(userId: UniqueEntityID): Promise<NotificationUserData>;
}
