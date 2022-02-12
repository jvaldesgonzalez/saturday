import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, ValidateNested } from 'class-validator';
import { MultimediaType } from 'src/shared/domain/multimedia.value';

class UnknownField {
  @ApiProperty()
  header: string;
  @ApiProperty()
  body: string;
  @ApiProperty()
  inline: boolean;
}

class EventMultimedia {
  @ApiProperty()
  type: MultimediaType;
  @ApiProperty()
  url: string;
}

class PlaceBody {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  locationId: string;
  @ApiPropertyOptional()
  partnerRef?: string;
}

class TicketBody {
  @ApiProperty()
  price: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  description: string;
}

export class EventOccurrenceBody {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  dateTimeInit: Date;
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  dateTimeEnd: Date;
  @ValidateNested({ each: true })
  @Type(() => TicketBody)
  @ApiProperty({ type: [TicketBody] })
  newTickets: TicketBody[];
}

export class CreateEventBody {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: [UnknownField] })
  description: UnknownField[];
  @ApiProperty()
  category: string;
  @ApiProperty({ type: PlaceBody })
  place: PlaceBody;
  @ApiProperty()
  collaborators?: string[] = [];
  @ApiProperty({ type: [EventMultimedia] })
  multimedia: EventMultimedia[];
  @ApiProperty({ type: [EventOccurrenceBody] })
  @ValidateNested({ each: true })
  @Type(() => EventOccurrenceBody)
  newOccurrences: EventOccurrenceBody[];
}
