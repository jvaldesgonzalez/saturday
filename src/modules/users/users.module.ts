import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import { HostsModule } from '../hosts/hosts.module';
import usersUseCases from './application/use-cases';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserRepositoryFactory } from './infrastructure/repositories/user.repository.factory';
import usersControllers from './presentation/controllers';
import { UsersController } from './presentation/users.router';

@Module({
  imports: [DataAccessModule, HostsModule],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IRepositoryFactory',
      useClass: UserRepositoryFactory,
    },
    {
      provide: 'IUnitOfWorkFactory',
      useClass: Neo4jUnitOfWorkFactory,
    },
    ...usersUseCases,
    ...usersControllers,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
