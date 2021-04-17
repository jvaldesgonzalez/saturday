import { BaseError } from 'src/shared/core/BaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { UserEmail } from '../value-objects/user-email.value';

export namespace UserErrors {
  const _context = 'UserError';
  export class UserDoesntExists extends BaseError {
    readonly message: string;
    constructor(id: UniqueEntityID) {
      super({
        name: 'UserDoesntExist',
        message: `Doesn't exist user with id ${id.toString()}`,
        context: _context,
      });
    }
  }

  export type UserDoesntExistsResult<T> = Result<T, UserDoesntExists>;

  export class UserWithEmailDoesNotExist extends BaseError {
    readonly message: string;
    constructor(email: UserEmail) {
      super({
        name: 'UserWithEmailDoesNotExist',
        message: `Doesn't exist user with email ${email.value}`,
        context: _context,
      });
    }
  }

  export type UserWithEmailDoesNotExistResult<T> = Result<
    T,
    UserWithEmailDoesNotExist
  >;

  export class WrongPassword extends BaseError {
    constructor() {
      super({
        name: 'WrongPassword',
        message: `Wrong user password`,
        context: _context,
      });
    }
  }

  export type WrongPasswordResult<T> = Result<T, WrongPassword>;

  export class EmailExistsError extends BaseError {
    constructor(email: UserEmail) {
      super({
        name: 'EmailExistError',
        message: `User with email '${email.value}' already exist`,
        context: _context,
      });
    }
  }
  export type EmailExistsErrorResult<T> = Result<T, EmailExistsError>;
}
