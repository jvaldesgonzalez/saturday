import axios from 'axios';
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
      `https://graph.facebook.com/${userId}?access_token=${authToken}&fields=name,email,picture.width(500).height(500),birthday,gender`,
    );

    return {
      fullname: data.name,
      avatar: data.picture.data.url,
      authProviderId: data.id,
      authProvider: AuthProvider.Facebook,
      email: data.email,
      birthday: new Date(data.birthday),
      gender: data.gender,
    };
  }

  async checkValidAuthToken(
    authToken: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const response = await axios.get<{ id: string }>(
        `https://graph.facebook.com/${userId}?access_token=${authToken}`,
      );
      return Number(response.data.id) === Number(userId);
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
