import { ApiResponseProperty } from '@nestjs/swagger';

class PurchasedTicket {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  id: string;
}

class EventMultimedia {
  @ApiResponseProperty()
  type: string;
  @ApiResponseProperty()
  url: string;
}
class PurchasedEventInfo {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty({ type: EventMultimedia })
  multimedia: EventMultimedia;
  @ApiResponseProperty()
  dateTimeInit: Date;
  @ApiResponseProperty()
  dateTimeEnd: Date;
}

export class MyPurchases {
  @ApiResponseProperty()
  ticket: PurchasedTicket;
  @ApiResponseProperty()
  amountOfTickets: number;
  @ApiResponseProperty({ type: PurchasedEventInfo })
  event: PurchasedEventInfo;
}
