import axios from 'axios';
import { randomInt } from 'crypto';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { Gender } from 'src/modules/accounts-management/users/domain/value-objects/gender.value';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { IAuthProvider } from '../auth.provider.interface';

export interface IGoogleProvider extends IAuthProvider {}

export class GoogleProvider implements IGoogleProvider {
  async getProfileInfo(authToken: string): Promise<Partial<RegisterUserDto>> {
    const { data } = await axios.get<{
      names: any;
      photos: any;
      resourceName: any;
      emailAddresses: any;
      birthdays: any;
      genders: any;
    }>(
      `https://auth-proxy.saturdayhub.com/google/v1/people/me?personFields=names,genders,birthdays,emailAddresses,photos&sources=READ_SOURCE_TYPE_PROFILE&key=AIzaSyD2JxB0Phyr67epKLpqQW_1vGL16uOCY7o`,
      {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      },
    );

    const { year, month, day } = data.birthdays
      ? data.birthdays[0].date
      : { year: null, month: null, day: null };
    console.log(data);
    return {
      fullname: data.names ? data.names[0].displayName : null,
      avatar:
        'https://s3.saturdayhub.com/media/avatars/avatars-' +
        randomInt(1, 100).toString().padStart(2, '0') +
        '.jpg',
      authProviderId: data.resourceName.split('/')[1],
      authProvider: AuthProvider.Google,
      email: data.emailAddresses[0].value,
      birthday: year ? new Date(year, month - 1, day) : null,
      gender: data.genders ? data.genders[0].value : Gender.PreferNotSay,
    };
  }

  async checkValidAuthToken(authToken: string): Promise<string> {
    try {
      const response = await axios.get<{ emailAddresses: any }>(
        `https://auth-proxy.saturdayhub.com/google/v1/people/me?personFields=names,genders,birthdays,emailAddresses,photos&sources=READ_SOURCE_TYPE_PROFILE&key=AIzaSyD2JxB0Phyr67epKLpqQW_1vGL16uOCY7o`,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log({ response });
      return response.data.emailAddresses[0].value;
    } catch (err) {
      console.error(err.response);
      return null;
    }
  }
}
