import { CreateAccountDto } from 'src/modules/accounts-management/common/application/dto/create-account.dto';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { Gender } from 'src/modules/accounts-management/users/domain/value-objects/gender.value';

export type RegisterUserDto = {
  authToken: string;
  description: string;
  fullname?: string;
  birthday?: Date;
  gender?: Gender;
  categoryPreferences: string[];
  locationId: string;
  authProviderId: string;
  authProvider: AuthProvider;
} & Omit<CreateAccountDto, 'username'>;
