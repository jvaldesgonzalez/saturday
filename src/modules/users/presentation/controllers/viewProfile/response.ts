import { ApiProperty } from '@nestjs/swagger';

export class ViewProfileResponse {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profileImageUrl: string;
}
