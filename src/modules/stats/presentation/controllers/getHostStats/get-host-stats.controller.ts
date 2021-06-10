import { Inject, Injectable } from '@nestjs/common';
import { IStatsRepository } from 'src/modules/stats/infrastructure/interfaces/stats.repository.interface';
import { BaseController } from 'src/shared/http/BaseController';
import { GetHostStatsRequest } from './request';
import { GetHostStatsResponse } from './response';

@Injectable()
export class GetHostStatsController extends BaseController<
  GetHostStatsRequest,
  GetHostStatsResponse
> {
  constructor(
    @Inject('IStatsRepository') private _statsRepo: IStatsRepository,
  ) {
    super();
  }

  protected async executeImpl(
    req: GetHostStatsRequest,
  ): Promise<GetHostStatsResponse> {
    return await this._statsRepo.getHostStats(req.hostId);
  }
}
