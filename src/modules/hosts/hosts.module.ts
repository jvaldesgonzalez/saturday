import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import hostsUseCases from './application/use-cases';
import { HostRepository } from './infrastructure/implementation/host.repository';
import hostsControllers from './presentation/controllers';
import { HostsRouter } from './presentation/hosts.router';

@Module({
  imports: [DataAccessModule],
  providers: [
    {
      provide: 'IHostRepository',
      useClass: HostRepository,
    },
    ...hostsControllers,
    ...hostsUseCases,
  ],
  controllers: [HostsRouter],
})
export class HostsModule {}
