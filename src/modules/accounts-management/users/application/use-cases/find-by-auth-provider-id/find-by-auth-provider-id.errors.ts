import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { AuthProviderId } from '../../../domain/value-objects/auth-provider-id.value';

export namespace FindByAuthProviderIdErrors {
  const context = 'FindByAuthProviderIdErrors';

  export class UserNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(theId: AuthProviderId) {
      super(false, {
        message: `User not found with id ${theId}`,
        context,
      });
    }
  }
}
