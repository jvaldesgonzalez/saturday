import { ApiResponseProperty } from '@nestjs/swagger';

export class StatResume {
  @ApiResponseProperty()
  since: Date;
  @ApiResponseProperty()
  data: string;
  @ApiResponseProperty()
  variation: number; //in percent
}

export class GetResumeByHostResponse {
  @ApiResponseProperty({ type: StatResume })
  followers: StatResume;

  @ApiResponseProperty({ type: StatResume })
  incomingMoney: StatResume;
}
