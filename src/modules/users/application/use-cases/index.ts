import { ChangePasswordUseCase } from './change-password';
import { ChangeUsernameUseCase } from './change-username.usecase';
import { CheckUsernameUseCase } from './check-username.usecase';
import { CreateUserLocalUseCase } from './create-user-local.usecase';
import { CreateUserWithProviderUseCase } from './create-user-withprovider.usecase';
import { LoginUserUseCase } from './login-user.usecase';
import { RefreshTokenUseCase } from './refresh-token.usecase';
import { UpdateAppVersionUseCase } from './update-app-version';
import { UpdateFirebasePushIdUseCase } from './update-firebase-id';
import { UpdateProfileUseCase } from './update-profile.usecase';
import { ViewProfileUseCase } from './view-profile.usecase';

const usersUseCases = [
  ChangePasswordUseCase,
  ChangeUsernameUseCase,
  CheckUsernameUseCase,
  CreateUserLocalUseCase,
  CreateUserWithProviderUseCase,
  LoginUserUseCase,
  RefreshTokenUseCase,
  UpdateProfileUseCase,
  ViewProfileUseCase,
  UpdateFirebasePushIdUseCase,
  UpdateAppVersionUseCase,
];

export default usersUseCases;
