import { DateTime } from 'neo4j-driver-core';

export class EventEntity {
  publisher: {
    avatar: string;
    id: string;
    username: string;
  };
  name: string;
  multimedia: { type: string; url: string }[];
  place: { name: string; address: string };
  dateTimeInit: Date;
  dateTimeEnd: Date;
  id: string;
  basePrice: number;
}

export class EventFromDBEntity {
  publisher: {
    avatar: string;
    id: string;
    username: string;
  };
  name: string;
  multimedia: string;
  place: { name: string; address: string };
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
  id: string;
  basePrice: number;
}
