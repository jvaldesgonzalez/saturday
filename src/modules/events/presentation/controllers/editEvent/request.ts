import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateEventRequest } from '../createEvent/request';

export class EditEventRequest extends PartialType(
  OmitType(CreateEventRequest, ['occurrences'] as const),
) {
  @ApiProperty()
  eventId: string;
}

export class EditEventBody extends OmitType(EditEventRequest, [
  'publisher',
] as const) {}
