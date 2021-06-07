import { ApiResponseProperty } from '@nestjs/swagger';

class Stats {
  reached: number;
  interested: number;
  sharedTimes: number;
}

export class GetRecentHostEventsResponse {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  category: string;
  @ApiResponseProperty()
  dateTimeInit: Date;
  @ApiResponseProperty()
  place: string;
  @ApiResponseProperty()
  imageUrl: string;
  @ApiResponseProperty({ type: Stats })
  stats: Stats;
}
