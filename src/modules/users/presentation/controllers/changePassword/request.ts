import { ApiProperty, PickType } from '@nestjs/swagger';

export class ChangePasswordRequest {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}

export class ChangePasswordBody extends PickType(ChangePasswordRequest, [
  'newPassword',
  'oldPassword',
] as const) {}
