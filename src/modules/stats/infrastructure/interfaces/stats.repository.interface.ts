import { GetResumeByHostResponse } from '../../presentation/controllers/getResumeByHost/response';

export interface IStatsRepository {
  getResumeByHost(hostId: string): Promise<GetResumeByHostResponse>;
}
