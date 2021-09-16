import { Module } from '@nestjs/common';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';
import { AccountsManagementModule } from './modules/accounts-management/accounts-management.module';
import { NomenclatorsModule } from './modules/nomenclators/nomenclators.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { StoriesModule } from './modules/stories/stories.module';
import { CommerceModule } from './modules/commerce/commerce.module';

@Module({
  imports: [
    DataAccessModule,
    AccountsManagementModule,
    PublicationsModule,
    NomenclatorsModule,
    StoriesModule,
    CommerceModule,
  ],
})
export class AppModule {}
