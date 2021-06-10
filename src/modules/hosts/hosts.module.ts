import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { StatsModule } from 'src/shared/modules/stats/stats.module';
import hostsUseCases from './application/use-cases';
import { RegisterBusinessUseCase } from './application/use-cases/registerBusiness/register-business.usecase';
import { HostRepository } from './infrastructure/implementation/host.repository';
import hostsControllers from './presentation/controllers';
import { HostsRouter } from './presentation/hosts.router';

@Module({
  imports: [DataAccessModule, StatsModule],
  providers: [
    {
      provide: 'IHostRepository',
      useClass: HostRepository,
    },
    ...hostsControllers,
    ...hostsUseCases,
  ],
  controllers: [HostsRouter],
  exports: [RegisterBusinessUseCase],
})
export class HostsModule {}
