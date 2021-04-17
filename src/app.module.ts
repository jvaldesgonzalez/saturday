import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';

@Module({
  imports: [DataAccessModule, UsersModule],
})
export class AppModule {}
