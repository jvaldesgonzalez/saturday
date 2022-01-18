import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckUserStatusFbRequest {
  @ApiProperty()
  @IsNotEmpty()
  authToken: string;

  @ApiProperty()
  @IsNotEmpty()
  authProviderId: string;
}

export class CheckUserStatusGRequest {
  @ApiProperty()
  @IsNotEmpty()
  authToken: string;
}
