import { ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

class PurchasedTicket {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  description: string;
  @ApiResponseProperty()
  price: number;
}

class EventPublisher {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  avatar: string;
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  username: string;
}

class EventPlace {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  @Type(() => Number)
  latitude: number;
  @ApiResponseProperty()
  @Type(() => Number)
  longitude: number;
  @ApiResponseProperty()
  address: string;
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
  @ApiResponseProperty({ type: EventPublisher })
  publisher: EventPublisher;
  @ApiResponseProperty({ type: EventPlace })
  @Type(() => EventPlace)
  place: EventPlace;
}

export class ReservationReadResponse {
  @ApiResponseProperty()
  ticket: PurchasedTicket;
  @ApiResponseProperty()
  amountOfTickets: number;
  @ApiResponseProperty({ type: PurchasedEventInfo })
  event: PurchasedEventInfo;
  @ApiResponseProperty()
  userId: string;
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  @IsOptional()
  couponApplied?: string;
  @ApiResponseProperty()
  securityPhrase: string;
  @ApiResponseProperty()
  toPayStr: string;
  @ApiResponseProperty()
  toPay: number;
}
