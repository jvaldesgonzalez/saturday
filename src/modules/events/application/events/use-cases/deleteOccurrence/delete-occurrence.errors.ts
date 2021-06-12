import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export namespace DeleteOccurrenceErrors {
  const _context = 'AddOccurrenceError';

  export class OccurrenceDoesntExist extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Doesn't exist occurence with id ${id.toString()}`,
        context: _context,
      });
    }
  }
}
