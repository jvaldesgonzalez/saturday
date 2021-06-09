import { ApiProperty, PickType } from '@nestjs/swagger';

export class UpdateAppVersionRequest {
  userId: string;

  @ApiProperty()
  appVersion: number;
}

export class UpdateAppVersionBody extends PickType(UpdateAppVersionRequest, [
  'appVersion',
] as const) {}
