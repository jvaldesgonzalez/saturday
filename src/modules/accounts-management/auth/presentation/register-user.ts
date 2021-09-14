import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsUrl, Min } from 'class-validator';
import { AuthProvider } from '../../users/domain/value-objects/auth-provider.value';
import { Gender } from '../../users/domain/value-objects/gender.value';

export class RegisterUserRequest {
  @ApiProperty()
  authToken: string;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  @Type(() => Date)
  birthday: Date;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty()
  categoryPreferences: string[];

  @ApiProperty()
  locationId: string;

  @ApiProperty()
  authProviderId: string;

  @ApiProperty({ enum: AuthProvider })
  authProvider: AuthProvider;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  firebasePushId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  appVersion: number;

  @ApiProperty()
  @IsUrl()
  avatar: string;
}
