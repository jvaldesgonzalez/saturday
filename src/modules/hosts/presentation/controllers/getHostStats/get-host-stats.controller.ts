import { Injectable } from '@nestjs/common';
import { BaseController } from 'src/shared/http/BaseController';
import { StatsService } from 'src/shared/modules/stats/stats.service';
import { GetHostStatsResponse } from 'src/shared/modules/stats/types/responses/get-host-stats.response';
import { GetHostStatsRequest } from './request';

@Injectable()
export class GetHostStatsController extends BaseController<
  GetHostStatsRequest,
  GetHostStatsResponse
> {
  constructor(private stats: StatsService) {
    super();
  }

  protected async executeImpl(
    req: GetHostStatsRequest,
  ): Promise<GetHostStatsResponse> {
    return await this.stats.getHostStats(req.hostId);
  }
}
