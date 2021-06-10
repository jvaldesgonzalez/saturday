import { ApiResponseProperty } from '@nestjs/swagger';
import { PieBarChartJSON } from 'src/modules/stats/charts/bar.chart';

class Ticket {
  @ApiResponseProperty()
  sold: number;
  @ApiResponseProperty()
  total: number;
  @ApiResponseProperty()
  price: string;
}

class Place {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  address: string;
  @ApiResponseProperty()
  latitude: string;
  @ApiResponseProperty()
  longitude: string;
  @ApiResponseProperty()
  hostRef?: string;
}

class Collaborator {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  profileImageUrl: string;
}

class Multimedia {
  @ApiResponseProperty()
  url: string;
  @ApiResponseProperty()
  type: string;
}

class UnknownField {
  @ApiResponseProperty()
  header: string;
  @ApiResponseProperty()
  body: string;
  @ApiResponseProperty()
  inline: boolean;
}

class EventData {
  @ApiResponseProperty()
  category: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty({ type: [UnknownField] })
  description: UnknownField[];
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  place: Place;
  @ApiResponseProperty({ type: [Collaborator] })
  collaborators: Collaborator[];
  @ApiResponseProperty({ type: [Multimedia] })
  multimedia: Multimedia[];
  @ApiResponseProperty({ type: [Date] })
  occurrencesDate: Date[];
}

export class GetEventStatsResponse {
  @ApiResponseProperty({ type: Ticket })
  tickets: Ticket;

  @ApiResponseProperty({ type: EventData })
  event: EventData;

  @ApiResponseProperty({ type: PieBarChartJSON })
  reachability: PieBarChartJSON;

  @ApiResponseProperty({ type: PieBarChartJSON })
  usersInterested: PieBarChartJSON;

  @ApiResponseProperty({ type: PieBarChartJSON })
  timesShared: PieBarChartJSON;
}
