import { ApiResponseProperty } from '@nestjs/swagger';
import { PieBarChartJSON } from 'src/modules/stats/charts/bar.chart';
import { LinearChartJSON } from 'src/modules/stats/charts/linear.chart';
import { ListChartJSON } from 'src/modules/stats/charts/list.chart';

export class GetHostStatsResponse {
  @ApiResponseProperty({ type: [ListChartJSON] })
  events: ListChartJSON[];

  @ApiResponseProperty({ type: [PieBarChartJSON] })
  audience: PieBarChartJSON[];

  @ApiResponseProperty({ type: [LinearChartJSON] })
  sells: LinearChartJSON[];
}
