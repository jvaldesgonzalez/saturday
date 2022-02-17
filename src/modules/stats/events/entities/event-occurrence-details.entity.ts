import { ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { DateTime } from 'neo4j-driver-core';
import { ListChartJSON } from '../../charts/list.chart';
import { PieBarChartJSON } from '../../charts/pie-bar.chart';

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

export class EventOccurrenceDetailsReadEntity {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  dateTimeInit: Date;
  @ApiResponseProperty({ type: [PieBarChartJSON, ListChartJSON] })
  charts: (ListChartJSON | PieBarChartJSON)[];
}

export class EventOccurrenceDetailsFromDB {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  dateTimeInit: DateTime<number>;
  // @ApiResponseProperty({ type: [PieBarChartJSON, ListChartJSON] })
  // chart: PieBarChartJSON;
  tickets: [Ticket];
}

export class EventWithOccurrenceDetailsReadEntity {
  eventId: string;
  eventName: string;
  imageUrl: string;
  occurrences: EventOccurrenceDetailsReadEntity[];
}

export class EventWithOccurrenceDetailsFromDB {
  eventId: string;
  eventName: string;
  imageUrl: string;
  occurrences: EventOccurrenceDetailsFromDB[];
}
