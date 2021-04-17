import { EnumRoles } from 'src/shared/domain/roles.enum';

export type JWTClaims = {
  id: string | number;
  role: EnumRoles;
  email: string;
  username: string;
};

export type JWTToken = string;
