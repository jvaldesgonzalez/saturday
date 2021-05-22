import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export namespace RemoveEventErrors {
  const _context = 'RemoveEventErrors';

  export class CollectionNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Collection ${id} not found`,
        context: _context,
      });
    }
  }

  export class EventNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Event ${id} not found`,
        context: _context,
      });
    }
  }
}
