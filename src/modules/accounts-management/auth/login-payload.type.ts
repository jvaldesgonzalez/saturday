import { EnumRoles } from 'src/shared/domain/roles.enum';

export type JWTToken = string;
export type RefreshToken = string;

export type LoginPayload = {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
};

export type JWTClaim = {
  username: string;
  email: string;
  id: string;
  role: EnumRoles;
};
