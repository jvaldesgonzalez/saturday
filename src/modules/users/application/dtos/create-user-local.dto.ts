import { EnumRoles } from 'src/shared/domain/roles.enum';

export type CreateUserDto = {
  fullname: string;
  username: string;
  profileImageUrl: string;
  email: string;
  firebasePushId: string;
  appVersion: number;
  password: string;
  role: EnumRoles;
};
