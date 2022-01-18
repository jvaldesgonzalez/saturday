import { RegisterUserDto } from '../application/dtos/register-user.dto';

export interface IAuthProvider {
  getProfileInfo(
    authToken: string,
    userId?: string,
  ): Promise<Partial<RegisterUserDto>>;
  checkValidAuthToken(authToken: string, userId?: string): Promise<string>;
}
