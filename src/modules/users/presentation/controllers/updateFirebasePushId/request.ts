import { ApiProperty, PickType } from '@nestjs/swagger';

export class UpdateFirebasePushIdRequest {
  userId: string;

  @ApiProperty()
  firebasePushId: string;
}

export class UpdateFirebasePushIdBody extends PickType(
  UpdateFirebasePushIdRequest,
  ['firebasePushId'] as const,
) {}
