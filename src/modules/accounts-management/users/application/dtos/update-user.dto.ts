import { PrivacyStatus } from '../../domain/value-objects/privacy-status.value';
import { CreateUserDto } from './create-user.dto';

export type UpdateUserDto = Partial<
  Omit<
    CreateUserDto,
    | 'authProviderId'
    | 'authProvider'
    | 'refreshToken'
    | 'firebasePushId'
    | 'appVersion'
  >
> & { id: string; privacyStatus: PrivacyStatus };
