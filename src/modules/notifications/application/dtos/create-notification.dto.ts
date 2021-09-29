type CreateNotificationBaseDto = {
  recipientId: string;
};

export type CreateFriendRequestNotificationDto = {
  requesterId: string;
} & CreateNotificationBaseDto;

export type CreateEventPublishedNotification = {
  eventId: string;
} & CreateNotificationBaseDto;

export type CreateEventSharedNotification = {
  eventId: string;
  senderId: string;
} & CreateNotificationBaseDto;
