import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { IIdentifier } from 'src/shared/domain/Identifier';

export namespace UpdateUserErrors {
  const context = 'UpdateUserErrors';

  export class UserNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(userId: IIdentifier) {
      super(false, {
        message: `User ${userId} not found`,
        context,
      });
    }
  }
}
