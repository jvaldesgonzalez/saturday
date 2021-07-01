import { ApiProperty, OmitType } from '@nestjs/swagger';

export class AddEventToCollectionRequest {
  publisher: string;
  @ApiProperty()
  collectionId: string;
  @ApiProperty()
  eventId: string;
}

export class AddEventToCollectionBody extends OmitType(
  AddEventToCollectionRequest,
  ['publisher', 'collectionId'] as const,
) {}
