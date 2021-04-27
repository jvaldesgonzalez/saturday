import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsUrl, IsEmail, IsInt } from 'class-validator';
import { AuthProvider } from 'src/modules/users/domain/value-objects/user-auth-provider.value';
import { EnumRoles } from 'src/shared/domain/roles.enum';

export class CreateUserProviderRequest {
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

  @ApiProperty({ enum: EnumRoles })
  @Type(() => (r: string): EnumRoles => r as EnumRoles)
  role: EnumRoles;

  @ApiProperty({ enum: AuthProvider })
  @Type(() => (r: string): AuthProvider => r as AuthProvider)
  provider: AuthProvider;
}
