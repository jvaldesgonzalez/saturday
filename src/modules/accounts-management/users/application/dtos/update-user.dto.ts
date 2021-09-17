import { CreateUserDto } from './create-user.dto';

export type UpdateUserDto = Partial<
  Omit<
    CreateUserDto,
    | 'authProviderId'
    | 'authProvider'
    | 'refreshToken'
    | 'username'
    | 'firebasePushId'
    | 'email'
    | 'appVersion'
  >
> & { id: string };
