import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, Min, ValidateNested } from 'class-validator';

class Ticket {
  @ApiProperty()
  @Min(1)
  price: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  description: string;
}

export class AddOccurrenceRequest {
  eventId: string;
  publisher: string;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateTimeInit: Date;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateTimeEnd: Date;
  @ApiProperty({ type: [Ticket] })
  @ValidateNested()
  @Type(() => Ticket)
  tickets: Ticket[];
}

export class AddOccurrenceBody extends OmitType(AddOccurrenceRequest, [
  'eventId',
  'publisher',
] as const) {}
