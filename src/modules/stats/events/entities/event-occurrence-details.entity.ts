import { ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { DateTime } from 'neo4j-driver-core';
import { PieBarChartJSON } from 'src/shared/modules/stats/charts/bar.chart';

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
  @ApiResponseProperty({ type: [Ticket] })
  tickets: Ticket[];
  @ApiResponseProperty()
  dateTimeInit: Date;
  @ApiResponseProperty({ type: PieBarChartJSON })
  stats: PieBarChartJSON;
}

export class EventOccurrenceDetailsFromDBReadEntity extends OmitType(
  EventOccurrenceDetailsReadEntity,
  ['dateTimeInit'] as const,
) {
  dateTimeInit: DateTime<number>;
}
