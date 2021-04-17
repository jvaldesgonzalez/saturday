import { User } from 'src/modules/users/domain/entities/user.entity';
import { IRepository } from 'src/shared/core/interfaces/IRepository';

export type IUserRepository = IRepository<User>;
