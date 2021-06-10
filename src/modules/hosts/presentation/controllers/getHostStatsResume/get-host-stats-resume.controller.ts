import { Injectable } from '@nestjs/common';
import { BaseController } from 'src/shared/http/BaseController';
import { StatsService } from 'src/shared/modules/stats/stats.service';
import { GetResumeByHostResponse } from 'src/shared/modules/stats/types/responses/get-host-stats-resume';
import { GetHostStatsRequest } from './request';

@Injectable()
export class GetHostStatsResumeController extends BaseController<
  GetHostStatsRequest,
  GetResumeByHostResponse
> {
  constructor(private stats: StatsService) {
    super();
  }

  protected async executeImpl(
    req: GetHostStatsRequest,
  ): Promise<GetResumeByHostResponse> {
    return await this.stats.getHostStatsResume(req.hostId);
  }
}
