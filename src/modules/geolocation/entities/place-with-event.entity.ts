import { DateTime } from 'neo4j-driver-core';

class PartnerPartialInfo {
  avatar: string;
  id: string;
  username: string;
}

export class EventWithPlaceEntity {
  publisher: PartnerPartialInfo;
  name: string;
  multimedia: { type: string; url: string }[];
  place: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    partnerRef?: PartnerPartialInfo;
  };
  dateTimeInit: Date;
  dateTimeEnd: Date;
  id: string;
  basePrice: number;
}

export class EventWithPlaceFromDBEntity {
  publisher: PartnerPartialInfo;
  name: string;
  multimedia: string;
  place: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    partnerRef: PartnerPartialInfo;
  };
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
  id: string;
  basePrice: number;
}
