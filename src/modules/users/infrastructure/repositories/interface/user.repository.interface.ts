import { User } from 'src/modules/users/domain/entities/user.entity';
import { Username } from 'src/modules/users/domain/value-objects';
import { UserEmail } from 'src/modules/users/domain/value-objects/user-email.value';
import { IRepository } from 'src/shared/core/interfaces/IRepository';

export interface IUserRepository extends IRepository<User> {
  existByEmail(email: UserEmail | string): Promise<boolean>;
  existByUsername(email: Username | string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
  findById(id: string): Promise<User>;
  findOneByEmail(emailOrUsername: UserEmail | string): Promise<User>;
}
