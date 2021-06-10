import { GetEventStatsResponse } from '../../types/responses/get-event-stats.response';
import { GetResumeByHostResponse } from '../../types/responses/get-host-stats-resume';
import { GetHostStatsResponse } from '../../types/responses/get-host-stats.response';

export interface IStatsRepository {
  getResumeByHost(hostId: string): Promise<GetResumeByHostResponse>;
  getEventStats(eventId: string): Promise<GetEventStatsResponse>;
  getHostStats(hostId: string): Promise<GetHostStatsResponse>;
}
