import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsString, IsUrl } from 'class-validator';
import { EnumRoles } from 'src/shared/domain/roles.enum';

export class CreateUserLocalRequest {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsUrl()
  profileImageUrl: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firebasePushId: string;

  @ApiProperty()
  @IsInt()
  appVersion: number;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enum: EnumRoles })
  @Type(() => (r: string): EnumRoles => r as EnumRoles)
  role: EnumRoles;
}
