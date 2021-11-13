import { DateTime } from 'neo4j-driver-core';

class PurchasedTicket {
  name: string;
  id: string;
  description: string;
  price: number;
}

class EventPublisher {
  name: string;
  avatar: string;
  id: string;
  username: string;
}

class EventPlace {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

class PurchasedEventInfo {
  id: string;
  name: string;
  multimedia: string;
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
  publisher: EventPublisher;
  place: EventPlace;
}

export class ReservationReadFromDBEntity {
  ticket: PurchasedTicket;
  amountOfTickets: number;
  event: PurchasedEventInfo;
  userId: string;
  id: string;
  couponApplied?: { code: string };
  securityPhrase: string;
  toPay: number;
  isValidated: boolean;
}
