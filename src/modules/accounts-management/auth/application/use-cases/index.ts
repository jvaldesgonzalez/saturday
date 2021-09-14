import { CheckUserStatusFacebook } from './check-user-status/check-user-status.facebook.usecase';
import { RegisterUser } from './register-user/register-user.usecase';

export const AuthUseCases = [CheckUserStatusFacebook, RegisterUser];
