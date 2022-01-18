import { CheckUserStatusFacebook } from './check-user-status/check-user-status.facebook.usecase';
import { CheckUserStatusGoogle } from './check-user-status/check-user.status.google.usecase';
import { LoginPartner } from './login-partner/login-partner.usecase';
import { LoginUserFacebook } from './login/login.facebook.usecase';
import { LoginUserGoogle } from './login/login.google.usecase';
import { RefreshToken } from './refresh-token/refresh-token.usecase';
import { RegisterPartner } from './register-partner/register-partner.usecase';
import { RegisterUserFacebook } from './register-user/register-user.facebook.usecase';
import { RegisterUserGoogle } from './register-user/register-user.google.usecase';

export const AuthUseCases = [
  CheckUserStatusFacebook,
  CheckUserStatusGoogle,
  RegisterUserFacebook,
  RegisterUserGoogle,
  LoginUserFacebook,
  LoginUserGoogle,
  RefreshToken,
  RegisterPartner,
  LoginPartner,
];
