import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export namespace AddOccurrenceErrors {
  const _context = 'AddOccurrenceError';

  export class OccurrenceDoesntExistInEvent extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Doesn't exist occurence with id ${id.toString()}`,
        context: _context,
      });
    }
  }

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
