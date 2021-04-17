import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserRepositoryFactory } from './infrastructure/repositories/user.repository.factory';
import { UsersController } from './presentation/user.controller';

@Module({
  imports: [DataAccessModule],
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
    CreateUserUseCase,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
