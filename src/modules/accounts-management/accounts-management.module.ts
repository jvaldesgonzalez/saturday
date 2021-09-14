import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { AuthUseCases } from './auth/application/use-cases';
import { AuthController } from './auth/auth.controller';
import { UserProviders } from './users/providers/providers.enum';
import { UserUseCases } from './users/application/use-cases';
import { UserRepository } from './users/infrastucture/repository/user.repository';
import { AuthProvider } from './users/domain/value-objects/auth-provider.value';
import { FacebookProvider } from './auth/providers/facebook/facebook.provider';

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
      provide: AuthProvider.Facebook,
      useClass: FacebookProvider,
    },
  ],
  controllers: [AuthController],
})
export class AccountsManagementModule {}
