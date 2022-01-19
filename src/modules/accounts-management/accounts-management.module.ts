import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { AuthUseCases } from './auth/application/use-cases';
import { AuthController } from './auth/auth.controller';
import { UserProviders } from './users/providers/providers.enum';
import { UserUseCases } from './users/application/use-cases';
import { UserRepository } from './users/infrastucture/repository/user.repository';
import { FacebookProvider } from './auth/providers/facebook/facebook.provider';
import { AuthProviders } from './auth/providers/providers.enum';
import { UsersReadService } from './users/users.read-service';
import { UsersController } from './users/users.controller';
import { AccountsController } from './accounts-management.controller';
import { AccountsManagementReadService } from './accounts-management.read-service';
import { PartnersReadService } from './partners/partners.read-service';
import { PartnersController } from './partners/partners.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { PartnerProviders } from './partners/providers/providers.enum';
import { PartnerRepository } from './partners/infrastructure/repository/partner.repository';
import PartnerUseCases from './partners/application/usecases';
import { GoogleProvider } from './auth/providers/google/google.provider';
import { AppleProvider } from './auth/providers/apple/apple.provider';

@Module({
  providers: [
    DataAccessModule,
    ...UserUseCases,
    UsersReadService,
    ...AuthUseCases,
    AccountsManagementReadService,
    PartnersReadService,
    ...PartnerUseCases,
    {
      provide: UserProviders.IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AuthProviders.IFacebookProvider,
      useClass: FacebookProvider,
    },
    {
      provide: AuthProviders.IAppleProvider,
      useClass: AppleProvider,
    },
    {
      provide: AuthProviders.IGoogleProvider,
      useClass: GoogleProvider,
    },
    {
      provide: PartnerProviders.IPartnerRepository,
      useClass: PartnerRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [
    AuthController,
    UsersController,
    AccountsController,
    PartnersController,
  ],
})
export class AccountsManagementModule {}
