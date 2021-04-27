import { ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JWTToken } from 'src/modules/users/domain/value-objects/token.value';

export class RefreshTokenResponse {
  @ApiResponseProperty()
  @Type(() => (s: string): JWTToken => s as JWTToken)
  accessToken: JWTToken;
}
