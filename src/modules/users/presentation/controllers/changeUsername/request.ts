import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChangeUsernameRequest {
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class ChangeUsernameBody extends PickType(ChangeUsernameRequest, [
  'username',
] as const) {}
