import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class EditProfileRequest {
  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  fullname: string;

  @ApiPropertyOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsUrl()
  profileImageUrl: string;
}

export class EditProfileBody extends PickType(EditProfileRequest, [
  'email',
  'fullname',
  'profileImageUrl',
] as const) {}
