import { DateTime } from 'neo4j-driver-core';
import { PieBarChartJSON } from '../../charts/pie-bar.chart';

export class EventDetailsReadEntity {
  tickets: {
    price: string;
    total: number;
    sold: number;
  };
  reachability: PieBarChartJSON;
  usersInterested: PieBarChartJSON;
  timesShared: PieBarChartJSON;
  event: {
    category: string;
    name: string;
    multimedia: {
      type: string;
      url: string;
    };
    id: string;
    occurrencesDate: Date[];
    collaborators: string[];
    place: {
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    description: [
      {
        header: string;
        body: string;
        inline: boolean;
      },
    ];
  };
}

export class EventDetailsFromDBReadEntity {
  tickets: {
    price: [number, number];
    total: number;
    sold: number;
  };
  reachability: PieBarChartJSON;
  usersInterested: PieBarChartJSON;
  timesShared: PieBarChartJSON;
  event: {
    category: string;
    name: string;
    multimedia: string;
    id: string;
    occurrencesDate: DateTime<number>[];
    collaborators: string[];
    place: {
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    description: string;
  };
}
