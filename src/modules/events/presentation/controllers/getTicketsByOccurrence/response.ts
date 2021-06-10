import { ApiResponseProperty } from '@nestjs/swagger';
import { PieBarChartJSON } from 'src/modules/stats/charts/bar.chart';

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

class Occurrence {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty({ type: [Ticket] })
  tickets: Ticket[];
  @ApiResponseProperty()
  dateTime: Date;
  @ApiResponseProperty({ type: PieBarChartJSON })
  stats: PieBarChartJSON;
}

export class GetTicketsByOccurrenceResponse {
  @ApiResponseProperty({ type: [Occurrence] })
  occurrences: Occurrence[];
}
