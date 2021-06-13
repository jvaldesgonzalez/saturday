import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UpdateCollectionRequest {
  collectionId: string;
  publisher: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}

export class UpdateCollectionBody extends OmitType(UpdateCollectionRequest, [
  'publisher',
  'collectionId',
] as const) {}
