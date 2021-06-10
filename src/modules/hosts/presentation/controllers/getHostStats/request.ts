import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class GetHostStatsRequest {
  hostId: string;

  @Type(() => Date)
  @IsDate()
  fromDate: Date;

  @Type(() => Date)
  @IsDate()
  toDate: Date;
}
