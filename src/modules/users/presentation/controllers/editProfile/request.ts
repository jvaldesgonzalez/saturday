import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EditProfileRequest {
  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  @IsEmail()
  email: string;
}

export class EditProfileBody extends PickType(EditProfileRequest, [
  'email',
] as const) {}
