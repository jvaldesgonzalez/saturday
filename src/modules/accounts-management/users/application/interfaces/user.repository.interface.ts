import {
  JWTClaim,
  RefreshToken,
} from 'src/modules/accounts-management/auth/login-payload.type';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { User } from '../../domain/user.domain';

export interface IUserRepository extends IRepository<User> {
  emailIsTaken(theEmail: string): Promise<boolean>;
  findByEmail(theEmail: string): Promise<User>;
  dropById(theUserId: string): Promise<void>;
  findById(theId: UniqueEntityID): Promise<User>;
  usernameIsTaken(theUserame: string): Promise<boolean>;
  getPayloadByRefreshToken(theToken: RefreshToken): Promise<JWTClaim>;
}
