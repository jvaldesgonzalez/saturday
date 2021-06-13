import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateCollectionRequest {
  publisher: string;
  @ApiProperty()
  eventsId: string[];
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}

export class CreateCollectionBody extends OmitType(CreateCollectionRequest, [
  'publisher',
] as const) {}
