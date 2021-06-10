import { ApiResponseProperty } from '@nestjs/swagger';
import { PieBarChartJSON } from '../../charts/bar.chart';
import { LinearChartJSON } from '../../charts/linear.chart';
import { ListChartJSON } from '../../charts/list.chart';

export class GetHostStatsResponse {
  @ApiResponseProperty({ type: [ListChartJSON] })
  events: ListChartJSON[];

  @ApiResponseProperty({ type: [PieBarChartJSON] })
  audience: PieBarChartJSON[];

  @ApiResponseProperty({ type: [LinearChartJSON] })
  sells: LinearChartJSON[];
}
