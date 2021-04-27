import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import userUseCases from './application/use-cases';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserRepositoryFactory } from './infrastructure/repositories/user.repository.factory';
import { CreateUserLocalController } from './presentation/controllers/createUserLocal/create-user-local.controller';
import { LoginUserController } from './presentation/controllers/loginUser/login-user.controller';
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
    ...userUseCases,
    CreateUserLocalController,
    LoginUserController,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
