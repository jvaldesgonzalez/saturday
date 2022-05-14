import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { IAuthProvider } from '../auth.provider.interface';
import verifyAppleToken from 'verify-apple-id-token';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { Gender } from 'src/modules/accounts-management/users/domain/value-objects/gender.value';
import { randomInt } from 'crypto';

type AppleIdJWTPayload = {
  iss: string; // the issuer registered claim key (should com e from appleid.apple.com)
  aud: string; // app's bundle id
  exp: number; // apple set this to 10 minutes
  iat: number;
  sub: string; // the subject registered claim key (this is a user id)
  nonce?: string;
  c_hash: string;
  email: string;
  email_verified: string | boolean; //boolean as string
  is_private_email?: string | boolean; // same as above
  auth_time: number;
};

export interface IAppleProvider extends IAuthProvider {}

export class AppleProvider implements IAppleProvider {
  async getProfileInfo(authToken: string): Promise<Partial<RegisterUserDto>> {
    const jwtPayload: AppleIdJWTPayload = await verifyAppleToken({
      idToken: authToken,
      clientId: 'com.saturdayhub.saturday',
    });
    console.log(jwtPayload);
    return {
      email: jwtPayload.email,
      authProvider: AuthProvider.Apple,
      authProviderId: jwtPayload.sub,
      gender: Gender.PreferNotSay,
      avatar:
        'https://s3.saturdayhub.com/avatars/avatars-' +
        randomInt(1, 100).toString().padStart(2, '0') +
        '.jpg',
    };
  }

  async checkValidAuthToken(authToken: string): Promise<string> {
    const jwtPayload: AppleIdJWTPayload = await verifyAppleToken({
      idToken: authToken,
      clientId: 'com.saturdayhub.saturday',
    });
    console.log(jwtPayload);
    return jwtPayload.email;
  }
}
