import { ApiResponseProperty } from '@nestjs/swagger';
import { AccountProfile } from '../../common/presentation/account-profile';
import { Gender } from '../domain/value-objects/gender.value';

export class UserProfile extends AccountProfile {
  @ApiResponseProperty()
  fullname: string;
  @ApiResponseProperty()
  birthday: Date;
  @ApiResponseProperty({ enum: Gender })
  gender: Gender;
  @ApiResponseProperty()
  categoryPreferences: string[];
  @ApiResponseProperty()
  locationId: string;
  @ApiResponseProperty()
  friends: number;
  @ApiResponseProperty()
  following: number;
}
