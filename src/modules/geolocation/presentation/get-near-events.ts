import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsLatitude,
  IsLongitude,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { PriceInterval } from 'src/modules/search-engine/presentation/search-event';

export class Location {
  @IsLatitude()
  @ApiProperty({ default: 23.12024611319827 })
  latitude: number;
  @IsLongitude()
  @ApiProperty({ default: -82.3671164112501 })
  longitude: number;
}

export class DateInterval {
  @ApiProperty({ default: '2020-10-04T03:42:50.819Z' })
  @IsDate()
  @Type(() => Date)
  from: Date;

  @ApiProperty({ default: '2022-10-04T03:42:50.819Z' })
  @IsDate()
  @Type(() => Date)
  to: Date;
}

export class GetNearEventsBody {
  @ApiProperty({ type: Location })
  @IsNotEmptyObject()
  location: Location;

  @IsNumber()
  @Min(500)
  @Max(1000000)
  @ApiProperty()
  distance: number;

  @ApiProperty({ type: DateInterval })
  @Type(() => DateInterval)
  dateInterval: DateInterval;

  @ApiPropertyOptional({ type: PriceInterval })
  @IsOptional()
  @Type(() => PriceInterval)
  priceInterval: PriceInterval;

  @IsUUID(4, { each: true })
  @ApiProperty({ type: [String] })
  categories: string[];
}
