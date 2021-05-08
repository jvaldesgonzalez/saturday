import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';

export namespace CreateCollectionErrors {
  const _context = 'CreateCollectionErrors';

  export class AllEventMustExists extends Result<IUseCaseError> {
    readonly message: string;
    constructor() {
      super(false, {
        message: `All events must exists`,
        context: _context,
      });
    }
  }
}
