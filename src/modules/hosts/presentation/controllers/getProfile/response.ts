import { ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class DescriptionField {
  @ApiResponseProperty()
  header: string;
  @ApiResponseProperty()
  body: string;
  @ApiResponseProperty()
  inline: boolean;
}

class HostPlace {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  address: string;
  @ApiResponseProperty()
  longitude: string;
  @ApiResponseProperty()
  latitude: string;
}

export class GetHostProfileResponse {
  @ApiResponseProperty()
  fullname: string;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  profileImageUrl: string;

  @ApiResponseProperty({ type: [DescriptionField] })
  aditionalBusinessData: DescriptionField[];

  @ApiResponseProperty({ type: HostPlace })
  @Type(() => HostPlace)
  place?: HostPlace;

  @ApiResponseProperty()
  followers: number;

  @ApiResponseProperty()
  events: number;
}
