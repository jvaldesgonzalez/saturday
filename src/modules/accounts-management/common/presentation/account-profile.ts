import { ApiResponseProperty } from '@nestjs/swagger';

export class AccountProfile {
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  email: string;
  @ApiResponseProperty()
  avatar: string;
  @ApiResponseProperty()
  id: string;
}
