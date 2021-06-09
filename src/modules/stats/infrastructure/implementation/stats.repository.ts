import { GetResumeByHostResponse } from '../../presentation/controllers/getResumeByHost/response';
import { IStatsRepository } from '../interfaces/stats.repository.interface';
import * as faker from 'faker';

export class StatsRepository implements IStatsRepository {
  async getResumeByHost(_hostId: string): Promise<GetResumeByHostResponse> {
    return {
      followers: {
        since: faker.date.recent(10),
        data: `${faker.datatype.number()}`,
        variation: faker.datatype.number({ min: -100, max: 100 }),
      },
      incomingMoney: {
        since: faker.date.recent(15),
        data: `${faker.datatype.number()}`,
        variation: faker.datatype.number({ min: -100, max: 100 }),
      },
    };
  }
}
