import { DateTime } from 'neo4j-driver-core';

class PlaceDetails {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  hostRef?: string;
}

class PartnerDetails {
  id: string;
  avatar: string;
  username: string;
}

class MultimediaDetails {
  type: string;
  url: string;
}

class UnknownFieldDetails {
  header: string;
  body: string;
  inline: boolean;
}

class CategoryDetails {
  name: string;
  id: string;
}

class TicketDetail {
  price: number;
  name: string;
  amount: number;
  description: string;
}

class OccurrenceDetails {
  dateTimeInit: Date;
  dateTimeEnd: Date;
  id: string;
  tickets: TicketDetail[];
}

class AttentionTagDetails {
  title: string;
  color: string;
  description: string;
}

export class EventReadEntity {
  publisher: PartnerDetails;
  id: string;
  name: string;
  info: UnknownFieldDetails[];
  category: CategoryDetails;
  place: PlaceDetails;
  multimedia: MultimediaDetails[];
  attentionTags: AttentionTagDetails[];
  occurrences: OccurrenceDetails[];
  dateTimeInit: Date;
  dateTimeEnd: Date;
  basePrice: number;
}

export class EventFromDBReadEntity {
  publisher: PartnerDetails;
  id: string;
  name: string;
  info: string;
  category: CategoryDetails;
  place: PlaceDetails;
  multimedia: string;
  attentionTags: AttentionTagDetails[];
  occurrences: OccurrenceDetails[];
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
  basePrice: number;
}
