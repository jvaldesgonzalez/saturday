import axios from 'axios';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { IAuthProvider } from '../auth.provider.interface';

export interface IFacebookProvider extends IAuthProvider {}

export class FacebookProvider implements IFacebookProvider {
  async getProfileInfo(
    authToken: string,
    userId: string,
  ): Promise<Partial<RegisterUserDto>> {
    const response = await axios({
      method: 'GET',
      url: `https://graph.facebook.com/${userId}?access_token=${authToken}&fields=name,email,picture.width(500).height(500),birthday,gender`,
    });

    return {
      fullname: response.data.name,
      avatar: response.data.picture.data.url,
      authProviderId: response.data.id,
      authProvider: AuthProvider.Facebook,
      email: response.data.email,
      birthday: new Date(response.data.birthday),
      gender: response.data.gender,
    };
  }

  async checkValidAuthToken(
    authToken: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://graph.facebook.com/${userId}?access_token=${authToken}`,
      });
      return Number(response.data.id) === Number(userId);
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
