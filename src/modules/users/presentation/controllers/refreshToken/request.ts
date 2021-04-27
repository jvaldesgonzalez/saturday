import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RefreshToken } from 'src/modules/users/domain/value-objects/token.value';

export class RefreshTokenRequest {
  @ApiProperty()
  @Type(() => (s: string): RefreshToken => s as RefreshToken)
  refreshToken: RefreshToken;
}
