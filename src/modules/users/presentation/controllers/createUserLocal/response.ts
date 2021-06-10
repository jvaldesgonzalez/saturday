import { ApiResponseProperty } from '@nestjs/swagger';

export class CreateUserLocalResponse {
  @ApiResponseProperty()
  accessToken: string;
  @ApiResponseProperty()
  refreshToken: string;
}
