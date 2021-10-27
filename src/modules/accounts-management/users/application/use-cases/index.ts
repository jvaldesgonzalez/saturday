import { CreateUser } from './create-user/create-user.usecase';
import { FindByAuthProviderId } from './find-by-auth-provider-id/find-by-auth-provider-id.usecase';
import { UpdateUser } from './update-user/update-user.usecase';

export const UserUseCases = [CreateUser, FindByAuthProviderId, UpdateUser];
