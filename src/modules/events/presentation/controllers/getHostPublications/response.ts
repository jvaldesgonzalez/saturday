import { ApiResponseProperty } from '@nestjs/swagger';

class Stats {
  @ApiResponseProperty()
  reached: number;
  @ApiResponseProperty()
  interested: number;
  @ApiResponseProperty()
  sharedTimes: number;
}

export class GetHostPublicationsResponse {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  id: string;
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
