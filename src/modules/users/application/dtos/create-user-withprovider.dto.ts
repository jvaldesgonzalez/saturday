import { EnumRoles } from 'src/shared/domain/roles.enum';
import { AuthProvider } from '../../domain/value-objects/user-auth-provider.value';

export type CreateUserWithProviderDto = {
  username: string;
  profileImageUrl: string;
  email: string;
  firebasePushId: string;
  appVersion: number;
  role: EnumRoles;
  provider: AuthProvider;
};
