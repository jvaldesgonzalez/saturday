import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

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

export class FilterEventsBody {
  @ApiProperty({ type: DateInterval })
  @Type(() => DateInterval)
  dateInterval: DateInterval;

  @IsUUID(4, { each: true })
  @ApiProperty({ type: [String] })
  categories: string[];
}
