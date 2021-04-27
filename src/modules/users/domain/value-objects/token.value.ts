import { EnumRoles } from 'src/shared/domain/roles.enum';

export type JWTClaims = {
  id: string;
  role: EnumRoles;
  email: string;
  username: string;
};

export type JWTToken = string;

export type RefreshToken = string;
