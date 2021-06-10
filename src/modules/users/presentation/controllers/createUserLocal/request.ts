import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { EnumRoles } from 'src/shared/domain/roles.enum';

export class CreateUserLocalRequest {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firebasePushId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  appVersion: number;

  @ApiProperty()
  @IsString()
  password: string;

  @IsEnum(EnumRoles)
  @Type(() => (t: string): EnumRoles => t as EnumRoles)
  role: EnumRoles;
}

export class CreateUserLocalBody extends OmitType(CreateUserLocalRequest, [
  'role',
] as const) {}
