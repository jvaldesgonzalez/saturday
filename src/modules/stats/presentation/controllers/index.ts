import { GetEventStatsController } from './getEventStats/get-event-stats.controller';
import { GetHostStatsController } from './getHostStats/get-host-stats.controller';
import { GetStatsResumeByHost } from './getResumeByHost/get-resume-by-host.controller';

const statsControllers = [
  GetStatsResumeByHost,
  GetEventStatsController,
  GetHostStatsController,
];

export default statsControllers;
