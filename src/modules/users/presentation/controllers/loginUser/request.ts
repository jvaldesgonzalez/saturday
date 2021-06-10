import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty()
  emailOrUsername: string;

  @ApiProperty()
  password: string;
}
