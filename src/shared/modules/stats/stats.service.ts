import { Inject, Injectable } from '@nestjs/common';
import { IStatsRepository } from './infrastructure/interfaces/stats.repository.interface';
import { GetEventStatsResponse } from './types/responses/get-event-stats.response';
import { GetResumeByHostResponse } from './types/responses/get-host-stats-resume';
import { GetHostStatsResponse } from './types/responses/get-host-stats.response';

@Injectable()
export class StatsService {
  constructor(
    @Inject('IStatsRepository') private _statsRepo: IStatsRepository,
  ) {}

  async getEventStats(eventId: string): Promise<GetEventStatsResponse> {
    return await this._statsRepo.getEventStats(eventId);
  }

  async getHostStats(hostId: string): Promise<GetHostStatsResponse> {
    return await this._statsRepo.getHostStats(hostId);
  }

  async getHostStatsResume(hostId: string): Promise<GetResumeByHostResponse> {
    return await this._statsRepo.getResumeByHost(hostId);
  }
}
