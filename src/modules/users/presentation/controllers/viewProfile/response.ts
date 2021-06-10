import { ApiProperty } from '@nestjs/swagger';

export class ViewProfileResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
