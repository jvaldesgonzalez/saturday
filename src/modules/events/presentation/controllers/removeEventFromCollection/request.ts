import { ApiProperty, OmitType } from '@nestjs/swagger';

export class RemoveEventFromCollectionRequest {
  publisher: string;
  @ApiProperty()
  collectionId: string;
  @ApiProperty()
  eventId: string;
}

export class RemoveEventFromCollectionBody extends OmitType(
  RemoveEventFromCollectionRequest,
  ['publisher'] as const,
) {}
