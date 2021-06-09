import { GetHostProfileController } from './getProfile/get-profile.controller';
import { RegisterBusinessController } from './registerBusiness/register-business.controller';
import { UpdateBusinessDetailsController } from './updateBusinessDetails/update-business-details.controller';

const hostsControllers = [
  RegisterBusinessController,
  UpdateBusinessDetailsController,
  GetHostProfileController,
];

export default hostsControllers;
