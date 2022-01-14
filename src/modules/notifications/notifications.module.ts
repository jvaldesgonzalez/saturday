import { Module } from '@nestjs/common';
import { CreateNotification } from './application/use-cases/createNotification/create-notification.usecase';
import { NotificationsRepository } from './infrastructure/repository/notifications.repository';
import { NotificationsController } from './notifications.controller';
import { NotificationsReadService } from './notifications.read-service';

@Module({
  providers: [
    NotificationsReadService,
    NotificationsRepository,
    CreateNotification,
  ],
  controllers: [NotificationsController],
  exports: [CreateNotification, NotificationsRepository],
})
export class NotificationsModule {}
