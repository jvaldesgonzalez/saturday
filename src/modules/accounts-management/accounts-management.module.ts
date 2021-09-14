import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { AuthUseCases } from './auth/application/use-cases';
import { AuthController } from './auth/auth.controller';
import { UserProviders } from './users/providers/providers.enum';
import { UserUseCases } from './users/application/use-cases';
import { UserRepository } from './users/infrastucture/repository/user.repository';
import { FacebookProvider } from './auth/providers/facebook/facebook.provider';
import { AuthProviders } from './auth/providers/providers.enum';

@Module({
  providers: [
    DataAccessModule,
    ...UserUseCases,
    ...AuthUseCases,
    {
      provide: UserProviders.IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AuthProviders.IFacebookProvider,
      useClass: FacebookProvider,
    },
  ],
  controllers: [AuthController],
})
export class AccountsManagementModule {}
