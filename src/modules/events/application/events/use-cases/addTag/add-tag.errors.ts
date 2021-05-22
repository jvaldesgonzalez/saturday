import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export namespace AddTagErrors {
  const _context = 'AddTagError';

  export class EventDoestnExists extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Doesn't exist event with id ${id.toString()}`,
        context: _context,
      });
    }
  }
}
