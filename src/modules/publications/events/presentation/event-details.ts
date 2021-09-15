import { ApiResponseProperty } from '@nestjs/swagger';

class PlaceDetails {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  address: string;
  @ApiResponseProperty()
  longitude: string;
  @ApiResponseProperty()
  latitude: string;
  @ApiResponseProperty()
  hostRef?: string;
}

class PartnerDetails {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  avatar: string;
  @ApiResponseProperty()
  username: string;
}

class MultimediaDetails {
  @ApiResponseProperty()
  type: string;
  @ApiResponseProperty()
  url: string;
}

class UnknownFieldDetails {
  @ApiResponseProperty()
  header: string;
  @ApiResponseProperty()
  body: string;
  @ApiResponseProperty()
  inline: boolean;
}

class CategoryDetails {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  id: string;
}

class TicketDetail {
  @ApiResponseProperty()
  price: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  amount: number;
  @ApiResponseProperty()
  description: string;
}

class OccurrenceDetails {
  @ApiResponseProperty()
  dateTimeInit: Date;
  @ApiResponseProperty()
  dateTimeEnd: Date;
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty({ type: [TicketDetail] })
  tickets: TicketDetail[];
}

export class EventDetails {
  @ApiResponseProperty({ type: PartnerDetails })
  publisher: PartnerDetails;
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty({ type: [UnknownFieldDetails] })
  info: UnknownFieldDetails[];
  @ApiResponseProperty({ type: CategoryDetails })
  category: CategoryDetails;
  @ApiResponseProperty({ type: PlaceDetails })
  place: PlaceDetails;
  @ApiResponseProperty()
  collaborators: string[];
  @ApiResponseProperty({ type: MultimediaDetails })
  multimedia: MultimediaDetails;
  @ApiResponseProperty()
  attentionTags: string[];
  @ApiResponseProperty({ type: OccurrenceDetails })
  occurrences: OccurrenceDetails[];
}
