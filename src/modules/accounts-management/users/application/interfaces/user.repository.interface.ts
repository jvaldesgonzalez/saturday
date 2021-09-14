import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { User } from '../../domain/user.domain';
import { AuthProviderId } from '../../domain/value-objects/auth-provider-id.value';

export interface IUserRepository extends IRepository<User> {
  emailIsTaken(theEmail: string): Promise<boolean>;
  findByAuthProviderId(theId: AuthProviderId): Promise<User>;
}
