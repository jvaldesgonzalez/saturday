import { ApiProperty, OmitType } from '@nestjs/swagger';

export class DeleteCollectionRequest {
  publisher: string;
  @ApiProperty()
  collectionId: string;
}

export class DeleteCollectionBody extends OmitType(DeleteCollectionRequest, [
  'publisher',
] as const) {}
