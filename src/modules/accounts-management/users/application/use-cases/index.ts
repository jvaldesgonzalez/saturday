import { CreateUser } from './create-user/create-user.usecase';
import { RemoveUser } from './remove-user/remove-user.usecase';
import { UpdateUser } from './update-user/update-user.usecase';

export const UserUseCases = [CreateUser, UpdateUser, RemoveUser];
