import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { StatsRepository } from './infrastructure/implementation/stats.repository';
import statsControllers from './presentation/controllers';
import { StatsRouter } from './presentation/stats.router';

@Module({
  imports: [DataAccessModule],
  providers: [
    {
      provide: 'IStatsRepository',
      useClass: StatsRepository,
    },
    ...statsControllers,
  ],
  controllers: [StatsRouter],
})
export class StatsModule {}
