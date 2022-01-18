import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserFbRequest {
  @ApiProperty()
  @IsNotEmpty()
  authToken: string;

  @ApiProperty()
  @IsNotEmpty()
  authProviderId: string;
}

export class LoginUserGRequest {
  @ApiProperty()
  @IsNotEmpty()
  authToken: string;
}
