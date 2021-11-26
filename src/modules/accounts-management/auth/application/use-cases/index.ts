import { CheckUserStatusFacebook } from './check-user-status/check-user-status.facebook.usecase';
import { LoginPartner } from './login-partner/login-partner.usecase';
import { LoginUser } from './login/login.usecase';
import { RefreshToken } from './refresh-token/refresh-token.usecase';
import { RegisterPartner } from './register-partner/register-partner.usecase';
import { RegisterUser } from './register-user/register-user.usecase';

export const AuthUseCases = [
  CheckUserStatusFacebook,
  RegisterUser,
  LoginUser,
  RefreshToken,
  RegisterPartner,
  LoginPartner,
];
