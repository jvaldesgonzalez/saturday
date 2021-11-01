import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { RefreshToken } from '../../../login-payload.type';

export namespace RefreshTokenErrors {
  const context = 'RefreshTokenErrors';

  export class UserNotFoundInDatabase extends Result<IUseCaseError> {
    readonly message: string;
    constructor(theToken: RefreshToken) {
      super(false, {
        message: `User ${theToken} not found`,
        context,
      });
    }
  }
}
