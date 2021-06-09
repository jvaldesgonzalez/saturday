import { ApiResponseProperty } from '@nestjs/swagger';

class Ticket {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  sold: number;

  @ApiResponseProperty()
  total: number;

  @ApiResponseProperty()
  price: string;
}

export class GetTicketsByOccurrenceResponse {
  @ApiResponseProperty({ type: [Ticket] })
  tickets: Ticket[];
}
