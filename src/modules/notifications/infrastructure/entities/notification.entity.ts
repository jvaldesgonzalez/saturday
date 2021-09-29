import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';
import { NotificationType } from '../../enums/notification-type';

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

export class NotificationEntity extends PersistentEntity {
  recipientId: string;
  type: NotificationType;
  eventData?: NotificationEventData;
  userData?: NotificationUserData;
}
