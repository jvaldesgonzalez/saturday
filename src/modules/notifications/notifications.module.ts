import { Module } from '@nestjs/common';
import { NotificationsRepository } from './infrastructure/repository/notifications.repository';
import { NotificationsController } from './notifications.controller';
import { NotificationsReadService } from './notifications.read-service';

@Module({
  providers: [NotificationsReadService, NotificationsRepository],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
