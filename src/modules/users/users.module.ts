import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { Neo4jUnitOfWorkFactory } from 'src/shared/modules/data-access/neo4j/unit-of-work.neo4j.factory';
import userUseCases from './application/use-cases';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserRepositoryFactory } from './infrastructure/repositories/user.repository.factory';
import { ChangeUsernameController } from './presentation/controllers/changeUsername/change-username.controller';
import { CHeckUsernameController } from './presentation/controllers/checkUsername/check-username.controller';
import { CreateUserLocalController } from './presentation/controllers/createUserLocal/create-user-local.controller';
import { LoginUserController } from './presentation/controllers/loginUser/login-user.controller';
import { RefreshTokenController } from './presentation/controllers/refreshToken/refresh-token.controller';
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
    RefreshTokenController,
    CHeckUsernameController,
    ChangeUsernameController,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
