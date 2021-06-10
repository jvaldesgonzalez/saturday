import { Inject, Injectable } from '@nestjs/common';
import { IStatsRepository } from 'src/modules/stats/infrastructure/interfaces/stats.repository.interface';
import { BaseController } from 'src/shared/http/BaseController';
import { GetEventStatsRequest } from './request';
import { GetEventStatsResponse } from './response';

@Injectable()
export class GetEventStatsController extends BaseController<
  GetEventStatsRequest,
  GetEventStatsResponse
> {
  constructor(
    @Inject('IStatsRepository') private _statsRepo: IStatsRepository,
  ) {
    super();
  }

  protected async executeImpl(
    req: GetEventStatsRequest,
  ): Promise<GetEventStatsResponse> {
    return await this._statsRepo.getEventStats(req.eventId);
  }
}
