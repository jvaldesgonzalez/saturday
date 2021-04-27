import { ApiProperty } from '@nestjs/swagger';

export class ViewProfileRequest {
  @ApiProperty()
  userId: string;
}

export class ViewProfileBody {}
