import {
  JWTClaim,
  RefreshToken,
} from 'src/modules/accounts-management/auth/login-payload.type';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { User } from '../../domain/user.domain';
import { AuthProviderId } from '../../domain/value-objects/auth-provider-id.value';

export interface IUserRepository extends IRepository<User> {
  emailIsTaken(theEmail: string): Promise<boolean>;
  findByAuthProviderId(theId: AuthProviderId): Promise<User>;
  findById(theId: UniqueEntityID): Promise<User>;
  usernameIsTaken(theUserame: string): Promise<boolean>;
  getPayloadByRefreshToken(theToken: RefreshToken): Promise<JWTClaim>;
}
