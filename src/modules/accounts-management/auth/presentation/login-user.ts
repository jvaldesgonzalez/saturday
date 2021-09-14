import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty()
  authToken: string;

  @ApiProperty()
  userId: string;
}
