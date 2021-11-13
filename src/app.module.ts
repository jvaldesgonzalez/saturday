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
import { PromModule } from '@digikare/nestjs-prom';

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'saturday_server',
        version: '0.1.0',
      },
    }),
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
  ],
})
export class AppModule {}
