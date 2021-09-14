import { ApiProperty } from '@nestjs/swagger';

export class CheckUserStatusFbRequest {
  @ApiProperty()
  authToken: string;

  @ApiProperty()
  userId: string;
}
