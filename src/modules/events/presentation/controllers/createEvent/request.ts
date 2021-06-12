import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MultimediaType } from 'src/shared/domain/multimedia.value';

class Place {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  longitude: string;
  @ApiProperty()
  latitude: string;
  @ApiProperty()
  hostRef: string;
}

class EventDescription {
  @ApiProperty()
  header: string;
  @ApiProperty()
  body: string;
  @ApiProperty()
  inline: boolean;
}

class Multimedia {
  @ApiProperty({ enum: ['image', 'video'] })
  @Type(() => (s: string): MultimediaType => s as MultimediaType)
  type: MultimediaType;
  @ApiProperty()
  url: string;
}

class Ticket {
  @ApiProperty()
  price: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  description: string;
}

class Occurrence {
  @ApiProperty()
  dateTimeInit: Date;
  @ApiProperty()
  dateTimeEnd: Date;
  @ApiProperty({ type: [Ticket] })
  tickets: Ticket[];
}

export class CreateEventRequest {
  @ApiProperty()
  publisher: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: [EventDescription] })
  description: EventDescription[];
  @ApiProperty()
  categories: string[];
  @ApiPropertyOptional({ type: Place })
  place?: Place;
  @ApiPropertyOptional()
  collaborators?: string[];
  @ApiProperty({ type: [Multimedia] })
  multimedia: Multimedia[];
  @ApiPropertyOptional({ type: [Occurrence] })
  occurrences: Occurrence[];
}

export class CreateEventBody extends OmitType(CreateEventRequest, [
  'publisher',
] as const) {}
