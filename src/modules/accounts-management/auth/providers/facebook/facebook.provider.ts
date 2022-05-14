import axios from 'axios';
import { randomInt } from 'crypto';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { Gender } from 'src/modules/accounts-management/users/domain/value-objects/gender.value';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { IAuthProvider } from '../auth.provider.interface';

export interface IFacebookProvider extends IAuthProvider {}

export class FacebookProvider implements IFacebookProvider {
  async getProfileInfo(
    authToken: string,
    userId: string,
  ): Promise<Partial<RegisterUserDto>> {
    const { data } = await axios.get<{
      name: string;
      picture: any;
      id: string;
      email: string;
      birthday: string;
      gender: Gender;
    }>(
      `https://auth-proxy.saturdayhub.com/facebook/${userId}?access_token=${authToken}&fields=name,email,picture.width(500).height(500),birthday,gender`,
    );

    return {
      fullname: data.name,
      avatar:
        'https://s3.saturdayhub.com/avatars/avatars-' +
        randomInt(1, 100).toString().padStart(2, '0') +
        '.png',
      authProviderId: data.id,
      authProvider: AuthProvider.Facebook,
      email: data.email,
      birthday: new Date(data.birthday),
      gender: data.gender ? data.gender : Gender.PreferNotSay,
    };
  }

  async checkValidAuthToken(
    authToken: string,
    userId: string,
  ): Promise<string> {
    try {
      const response = await axios.get<{ email: string }>(
        `https://auth-proxy.saturdayhub.com/facebook/${userId}?access_token=${authToken}&fields=email`,
      );
      return response.data.email ? response.data.email : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
