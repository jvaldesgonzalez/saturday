import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export namespace EditTicketErrors {
  const _context = 'EditTicketError';

  export class OccurrenceDoesntExists extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Doesn't exist occurence with id ${id.toString()}`,
        context: _context,
      });
    }
  }

  export class TicketDoestnExists extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Doesn't exist ticket with id ${id.toString()}`,
        context: _context,
      });
    }
  }
}
