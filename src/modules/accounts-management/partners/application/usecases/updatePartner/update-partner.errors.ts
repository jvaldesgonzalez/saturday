import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { IIdentifier } from 'src/shared/domain/Identifier';

export namespace UpdatePartnerErrors {
  const context = 'UpdatePartnerErrors';

  export class PartnerNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(partnerId: IIdentifier) {
      super(false, {
        message: `Partner ${partnerId} not found`,
        context,
      });
    }
  }

  export class EmailExistsError extends Result<IUseCaseError> {
    readonly message: string;
    constructor(theEmail: string) {
      super(false, {
        message: `The email ${theEmail} already exists`,
        context,
      });
    }
  }

  export class UsernameExistsError extends Result<IUseCaseError> {
    readonly message: string;
    constructor(theusername: string) {
      super(false, {
        message: `The username ${theusername} already exists`,
        context,
      });
    }
  }
}
