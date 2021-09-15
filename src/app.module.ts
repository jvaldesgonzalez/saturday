import { Module } from '@nestjs/common';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';
import { AccountsManagementModule } from './modules/accounts-management/accounts-management.module';
import { EventsModule } from './modules/events/events.module';
import { NomenclatorsModule } from './modules/nomenclators/nomenclators.module';

@Module({
  imports: [
    DataAccessModule,
    AccountsManagementModule,
    EventsModule,
    NomenclatorsModule,
  ],
})
export class AppModule {}
