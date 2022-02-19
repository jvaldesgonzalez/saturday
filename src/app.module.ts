import { Module } from '@nestjs/common';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';
import { AccountsManagementModule } from './modules/accounts-management/accounts-management.module';
import { NomenclatorsModule } from './modules/nomenclators/nomenclators.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { StoriesModule } from './modules/stories/stories.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { SearchEngineModule } from './modules/search-engine/search-service.module';
import { SocialGraphModule } from './modules/social-graph/social-graph.module';
import { RecommenderModule } from './modules/recommender/recommender.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { GeolocationModule } from './modules/geolocation/geolocation.module';
import { StaticsModule } from './modules/statics/statics.module';
import { StatsModule } from './modules/stats/stats.module';
import { MetricsModule } from './shared/modules/metrics/metrics.module';
import { FirebaseAdminModule } from './shared/firebase/firebase.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AttentionTagsModule } from './modules/attention-tags/attention-tags.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './modules/logging.interceptor';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FirebaseAdminModule,
    MetricsModule,
    DataAccessModule,
    AccountsManagementModule,
    PublicationsModule,
    NomenclatorsModule,
    StoriesModule,
    CommerceModule,
    SearchEngineModule,
    SocialGraphModule,
    RecommenderModule,
    NotificationsModule,
    GeolocationModule,
    StaticsModule,
    StatsModule,
    MetricsModule,
    AttentionTagsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
