import { PrivacyStatus } from '../../domain/value-objects/privacy-status.value';
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
> & { id: string; privacyStatus: PrivacyStatus };
