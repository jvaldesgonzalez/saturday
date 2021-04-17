import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserEmail } from 'src/modules/users/domain/value-objects/user-email.value';
import { IRepository } from 'src/shared/core/interfaces/IRepository';

export interface IUserRepository extends IRepository<User> {
  existByEmail(email: UserEmail): Promise<boolean>;
}
