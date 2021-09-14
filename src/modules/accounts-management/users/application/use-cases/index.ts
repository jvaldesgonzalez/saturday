import { CreateUser } from './create-user/create-user.usecase';
import { FindByAuthProviderId } from './find-by-auth-provider-id/find-by-auth-provider-id.usecase';

export const UserUseCases = [CreateUser, FindByAuthProviderId];
