import { Module } from '@nestjs/common';
import { EventsModule } from './modules/events/events.module';
import { StoriesModule } from './modules/stories/stories.module';
import { UsersModule } from './modules/users/users.module';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';
import { StatsModule } from './modules/stats/stats.module';
import { HostsModule } from './modules/hosts/hosts.module';

@Module({
  imports: [
    DataAccessModule,
    UsersModule,
    EventsModule,
    StoriesModule,
    StatsModule,
    HostsModule,
  ],
})
export class AppModule {}
