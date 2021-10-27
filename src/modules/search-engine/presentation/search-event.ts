import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

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

export class PriceInterval {
  @ApiProperty()
  @IsDate()
  from: number;

  @ApiProperty()
  @IsDate()
  to: number;
}

export class FilterEventsBody {
  @ApiPropertyOptional({ type: DateInterval })
  @IsOptional()
  @Type(() => DateInterval)
  dateInterval: DateInterval;

  @IsOptional()
  @IsUUID(4, { each: true })
  @ApiPropertyOptional({ type: [String] })
  categories: string[];

  @ApiPropertyOptional({ type: PriceInterval })
  @IsOptional()
  @Type(() => PriceInterval)
  priceInterval: PriceInterval;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID(4)
  locationId: string;
}
