import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
} from 'class-validator';
import { Gender } from '../../users/domain/value-objects/gender.value';

export class LoginParams {
  @ApiProperty()
  @IsNotEmpty()
  authToken: string;

  @ApiProperty()
  @IsNotEmpty()
  authProviderId: string;
}
export class RegisterUserRequest {
  @ApiProperty({ type: LoginParams })
  @IsNotEmpty()
  loginParams: LoginParams;

  @ApiProperty()
  @IsNotEmpty()
  fullname: string;

  @ApiPropertyOptional()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  birthday: Date;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  categoryPreferences: string[];

  @ApiProperty()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  firebasePushId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  appVersion: number;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  avatar: string;
}
