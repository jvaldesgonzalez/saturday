import { DateTime } from 'neo4j-driver-core';

export class EventListItemFromDBReadEntity {
  id: string;
  name: string;
  category: string;
  dateTimeInit: DateTime<number>;
  place: string;
  createdAt: DateTime<number>;
  multimedia: string;
  stats: {
    reached: number;
    interested: number;
    sharedTimes: number;
  };
}

export class EventListItemReadEntity {
  id: string;
  name: string;
  category: string;
  dateTimeInit: Date;
  place: string;
  imageUrl: string;
  stats: {
    reached: number;
    interested: number;
    sharedTimes: number;
  };
}
