import { CreateAccountDto } from 'src/modules/accounts-management/common/application/dto/create-account.dto';
import { AuthProvider } from '../../domain/value-objects/auth-provider.value';
import { Gender } from '../../domain/value-objects/gender.value';

export type CreateUserDto = {
  fullname: string;
  birthday?: Date;
  description: string;
  gender?: Gender;
  categoryPreferences: string[];
  locationId: string;
  authProviderId: string;
  authProvider: AuthProvider;
  refreshToken: string;
} & CreateAccountDto;
