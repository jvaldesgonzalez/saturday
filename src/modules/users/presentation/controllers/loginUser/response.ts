import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}
