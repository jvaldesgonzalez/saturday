import { Module } from '@nestjs/common';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';
import { AccountsManagementModule } from './modules/accounts-management/accounts-management.module';

@Module({
  imports: [DataAccessModule, AccountsManagementModule],
})
export class AppModule {}
