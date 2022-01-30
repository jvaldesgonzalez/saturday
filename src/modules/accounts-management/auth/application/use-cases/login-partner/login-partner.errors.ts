import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';

export namespace LoginPartnerErrors {
  const context = 'LoginPartnerErrors';

  export class PartnerIsNotVerified extends Result<IUseCaseError> {
    readonly message: string;
    constructor() {
      super(false, {
        message: `Partner is not verified`,
        context,
      });
    }
  }
}
