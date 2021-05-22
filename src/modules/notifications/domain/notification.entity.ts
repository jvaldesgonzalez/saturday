export type NotificationType =
  | 'friend-request'
  | 'fiend-request-acepted'
  | 'shared-event'
  | 'plan-invitation'
  | 'custom';

type NotificationProps = {
  title: string;
  description: string;
  type: NotificationType;
};
