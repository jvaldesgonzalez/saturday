import { ChangePasswordController } from './changePassword/change-password.controller';
import { ChangeUsernameController } from './changeUsername/change-username.controller';
import { CHeckUsernameController } from './checkUsername/check-username.controller';
import { CreateUserLocalController } from './createUserLocal/create-user-local.controller';
import { CreateUserProviderController } from './createUserProvider/create-user-provider.controller';
import { LoginUserController } from './loginUser/login-user.controller';
import { RefreshTokenController } from './refreshToken/refresh-token.controller';
import { ViewProfileController } from './viewProfile/view-profile.controller';

const usersControllers = [
  ChangePasswordController,
  ChangeUsernameController,
  CHeckUsernameController,
  CreateUserLocalController,
  CreateUserProviderController,
  LoginUserController,
  RefreshTokenController,
  ViewProfileController,
];

export default usersControllers;
