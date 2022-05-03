import { NotificationType } from '../../enums/notification-type';

export type CreateNotificationDto = {
  recipientId: string[];
  userId?: string;
  eventId?: string;
  type: NotificationType;
  reservationId?: string;
};
