import { User } from 'src/modules/users/domain/entities/user.entity';
import { Username } from 'src/modules/users/domain/value-objects';
import { UserEmail } from 'src/modules/users/domain/value-objects/user-email.value';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export interface IUserRepository extends IRepository<User> {
  existByEmail(email: UserEmail): Promise<boolean>;
  existByUsername(email: Username): Promise<boolean>;
  existsById(id: UniqueEntityID): Promise<boolean>;
  findById(id: UniqueEntityID): Promise<User>;
  findOneByEmail(emailOrUsername: UserEmail): Promise<User>;
}
