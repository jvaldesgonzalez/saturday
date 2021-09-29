import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsReadService } from './notifications.read-service';

@Module({
  providers: [NotificationsReadService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
