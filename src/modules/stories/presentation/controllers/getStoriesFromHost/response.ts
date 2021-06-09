import { ApiResponseProperty } from '@nestjs/swagger';

export class GetStoriesFromHostResponse {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  url: string;

  @ApiResponseProperty()
  type: string;

  @ApiResponseProperty()
  views: number;
}
