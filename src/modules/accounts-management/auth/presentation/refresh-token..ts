import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
