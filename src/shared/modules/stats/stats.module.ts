import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { StatsRepository } from './infrastructure/implementation/stats.repository';
import { StatsService } from './stats.service';

@Module({
  imports: [DataAccessModule],
  providers: [
    {
      provide: 'IStatsRepository',
      useClass: StatsRepository,
    },
    StatsService,
  ],
  exports: [StatsService],
})
export class StatsModule {}
