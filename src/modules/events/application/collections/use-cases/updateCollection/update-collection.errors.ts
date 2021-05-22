import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export namespace UpdateCollectionErrors {
  const _context = 'UpdateCollectionErrors';

  export class CollectionNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Collection ${id} not found`,
        context: _context,
      });
    }
  }
}
