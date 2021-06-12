import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInstance,
  IsNotEmptyObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
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
  hostRef?: string;
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
  @Min(1)
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
  @Type(() => Place)
  @IsInstance(Place)
  @IsOptional()
  @IsNotEmptyObject()
  place?: Place;
  @ApiPropertyOptional()
  collaborators?: string[];
  @ApiProperty({ type: [Multimedia] })
  multimedia: Multimedia[];
  @ApiPropertyOptional({ type: [Occurrence] })
  @ValidateNested()
  @Type(() => Occurrence)
  occurrences: Occurrence[];
}

export class CreateEventBody extends OmitType(CreateEventRequest, [
  'publisher',
] as const) {}
