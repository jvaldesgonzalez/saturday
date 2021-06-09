import { RegisterBusinessUseCase } from './registerBusiness/register-business.usecase';
import { UpdateBusinessDetailsUseCase } from './updateBusinessDetails/update-business-details.usecase';

const hostsUseCases = [RegisterBusinessUseCase, UpdateBusinessDetailsUseCase];

export default hostsUseCases;
