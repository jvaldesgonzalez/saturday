import { EnumRoles } from 'src/shared/domain/roles.enum';

export type CreateUserDto = {
  username: string;
  email: string;
  firebasePushId: string;
  appVersion: number;
  password: string;
  role: EnumRoles;
};
