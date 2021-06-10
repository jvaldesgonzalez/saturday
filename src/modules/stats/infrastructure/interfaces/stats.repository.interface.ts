import { GetEventStatsResponse } from '../../presentation/controllers/getEventStats/response';
import { GetHostStatsResponse } from '../../presentation/controllers/getHostStats/response';
import { GetResumeByHostResponse } from '../../presentation/controllers/getResumeByHost/response';

export interface IStatsRepository {
  getResumeByHost(hostId: string): Promise<GetResumeByHostResponse>;
  getEventStats(eventId: string): Promise<GetEventStatsResponse>;
  getHostStats(hostId: string): Promise<GetHostStatsResponse>;
}
