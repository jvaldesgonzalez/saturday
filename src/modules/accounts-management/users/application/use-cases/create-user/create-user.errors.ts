import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';

export namespace CreateUserErrors {
  const context = 'CreateUserErrors';

  export class EmailExistsError extends Result<IUseCaseError> {
    readonly message: string;
    constructor() {
      super(false, {
        message: `Email already exists`,
        context,
      });
    }
  }
}
