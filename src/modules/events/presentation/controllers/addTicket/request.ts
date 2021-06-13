import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class AddTicketRequest {
  publisher: string;
  occurrenceId: string;
  @ApiProperty()
  @Min(1)
  price: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  expandToAll = false;
}

export class AddTicketBody extends OmitType(AddTicketRequest, [
  'occurrenceId',
  'publisher',
  'expandToAll',
] as const) {}
