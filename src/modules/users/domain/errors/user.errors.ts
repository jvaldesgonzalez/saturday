import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { UserEmail } from '../value-objects/user-email.value';
import { Username } from '../value-objects/username.value';

export namespace UserErrors {
  const _context = 'UserError';
  export class UserDoesntExists extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID) {
      super(false, {
        message: `Doesn't exist user with id ${id.toString()}`,
        context: _context,
      });
    }
  }
  export class UserWithEmailOrUsernameDoesNotExist extends Result<IUseCaseError> {
    readonly message: string;
    constructor(emailOrUsername: UserEmail | Username) {
      super(false, {
        message: `Doesn't exist user with email ${emailOrUsername.value}`,
        context: _context,
      });
    }
  }

  export class WrongPassword extends Result<IUseCaseError> {
    constructor() {
      super(false, {
        message: `Wrong user password`,
        context: _context,
      });
    }
  }

  export class EmailExistsError extends Result<IUseCaseError> {
    constructor(email: UserEmail) {
      super(false, {
        message: `User with email '${email.value}' already exist`,
        context: _context,
      });
    }
  }

  export class UsernameExistsError extends Result<IUseCaseError> {
    constructor(email: Username) {
      super(false, {
        message: `User with username '${email.value}' already exist`,
        context: _context,
      });
    }
  }
}
