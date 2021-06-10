import { Injectable } from '@nestjs/common';
import { BaseController } from 'src/shared/http/BaseController';
import { StatsService } from 'src/shared/modules/stats/stats.service';
import { GetEventStatsResponse } from 'src/shared/modules/stats/types/responses/get-event-stats.response';
import { GetEventDetailsRequest } from './request';

@Injectable()
export class GetEventDetailsController extends BaseController<
  GetEventDetailsRequest,
  GetEventStatsResponse
> {
  constructor(private stats: StatsService) {
    super();
  }

  protected async executeImpl(
    req: GetEventDetailsRequest,
  ): Promise<GetEventStatsResponse> {
    return await this.stats.getEventStats(req.eventId);
  }
}
