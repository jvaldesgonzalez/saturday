import { Module } from '@nestjs/common';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';
import { AccountsManagementModule } from './modules/accounts-management/accounts-management.module';
import { CategoryModule } from './modules/categories/category.module';
import { LocationModule } from './modules/locations/location.module';

@Module({
  imports: [
    DataAccessModule,
    AccountsManagementModule,
    CategoryModule,
    LocationModule,
  ],
})
export class AppModule {}
