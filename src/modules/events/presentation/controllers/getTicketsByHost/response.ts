import { ApiResponseProperty } from '@nestjs/swagger';

class EventOccurrence {
  name: string;
  id: string;
  place: string;
  imageUrl: string;
}

export class GetTicketsByHostResponse {
  @ApiResponseProperty({ type: Event })
  occurrence: EventOccurrence;

  @ApiResponseProperty()
  price: string;

  @ApiResponseProperty()
  sold: number;

  @ApiResponseProperty()
  total: number;
}
