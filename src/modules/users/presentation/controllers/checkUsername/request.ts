import { ApiProperty } from '@nestjs/swagger';

export class CheckUsernameRequest {
  @ApiProperty()
  username: string;
}
