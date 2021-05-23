import { Module } from '@nestjs/common';
import { EventsModule } from './modules/events/events.module';
import { StoriesModule } from './modules/stories/stories.module';
import { UsersModule } from './modules/users/users.module';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';

@Module({
  imports: [DataAccessModule, UsersModule, EventsModule, StoriesModule],
})
export class AppModule {}
