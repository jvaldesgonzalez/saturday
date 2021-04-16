import { Module } from '@nestjs/common';
import { DataAccessModule } from './shared/modules/data-access/data-access.module';

@Module({
  imports: [DataAccessModule],
})
export class AppModule {}
