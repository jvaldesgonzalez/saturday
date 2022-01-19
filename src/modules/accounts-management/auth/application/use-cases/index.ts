import { CheckUserStatusApple } from './check-user-status/check-user-status.apple.usecase';
import { CheckUserStatusFacebook } from './check-user-status/check-user-status.facebook.usecase';
import { CheckUserStatusGoogle } from './check-user-status/check-user.status.google.usecase';
import { LoginPartner } from './login-partner/login-partner.usecase';
import { LoginUserApple } from './login/login.apple.usecase';
import { LoginUserFacebook } from './login/login.facebook.usecase';
import { LoginUserGoogle } from './login/login.google.usecase';
import { RefreshToken } from './refresh-token/refresh-token.usecase';
import { RegisterPartner } from './register-partner/register-partner.usecase';
import { RegisterUserApple } from './register-user/register-user.apple.usecase';
import { RegisterUserFacebook } from './register-user/register-user.facebook.usecase';
import { RegisterUserGoogle } from './register-user/register-user.google.usecase';

export const AuthUseCases = [
  CheckUserStatusFacebook,
  CheckUserStatusGoogle,
  CheckUserStatusApple,
  RegisterUserFacebook,
  RegisterUserGoogle,
  RegisterUserApple,
  LoginUserFacebook,
  LoginUserGoogle,
  LoginUserApple,
  RefreshToken,
  RegisterPartner,
  LoginPartner,
];
