import { GetHostStatsController } from './getHostStats/get-host-stats.controller';
import { GetHostStatsResumeController } from './getHostStatsResume/get-host-stats-resume.controller';
import { GetHostProfileController } from './getProfile/get-profile.controller';
import { RegisterBusinessController } from './registerBusiness/register-business.controller';
import { UpdateBusinessDetailsController } from './updateBusinessDetails/update-business-details.controller';

const hostsControllers = [
  RegisterBusinessController,
  UpdateBusinessDetailsController,
  GetHostProfileController,
  GetHostStatsResumeController,
  GetHostStatsController,
];

export default hostsControllers;
