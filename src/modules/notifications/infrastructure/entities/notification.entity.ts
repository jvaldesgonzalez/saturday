import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';
import { NotificationType } from '../../enums/notification-type';

export class NotificationEntity extends PersistentEntity {
  reservationId?: string;
  recipientId: string[];
  type: NotificationType;
  eventData?: string;
  userData?: string;
  viewed: boolean;
}
