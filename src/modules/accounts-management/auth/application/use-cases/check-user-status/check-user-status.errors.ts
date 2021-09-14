import { AuthProviderId } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider-id.value';
import { AuthProvider } from 'src/modules/accounts-management/users/domain/value-objects/auth-provider.value';
import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';

export namespace CheckUserStatusErrors {
  const context = 'CheckUserStatusErrors';

  export class UserNotFoundInProvider extends Result<IUseCaseError> {
    readonly message: string;
    constructor(theProviderId: AuthProviderId, provider: AuthProvider) {
      super(false, {
        message: `User ${theProviderId} not found at ${provider}`,
        context,
      });
    }
  }

  export class UserNotFoundInDatabase extends Result<IUseCaseError> {
    readonly message: string;
    constructor(theProviderId: AuthProviderId) {
      super(false, {
        message: `User ${theProviderId} not registered`,
        context,
      });
    }
  }
}
