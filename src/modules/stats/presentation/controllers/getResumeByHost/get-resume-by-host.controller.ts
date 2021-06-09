import { Inject, Injectable } from '@nestjs/common';
import { IStatsRepository } from 'src/modules/stats/infrastructure/interfaces/stats.repository.interface';
import { BaseController } from 'src/shared/http/BaseController';
import { GetResumeByHostRequest } from './request';
import { GetResumeByHostResponse } from './response';

@Injectable()
export class GetStatsResumeByHost extends BaseController<
  GetResumeByHostRequest,
  GetResumeByHostResponse
> {
  constructor(
    @Inject('IStatsRepository') private _statsRepo: IStatsRepository,
  ) {
    super();
  }

  protected async executeImpl(
    req: GetResumeByHostRequest,
  ): Promise<GetResumeByHostResponse> {
    return await this._statsRepo.getResumeByHost(req.hostId);
  }
}
