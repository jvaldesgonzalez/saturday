import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  authToken: string;

  @ApiProperty()
  @IsNotEmpty()
  authProviderId: string;
}
