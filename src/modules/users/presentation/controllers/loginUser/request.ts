import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
