import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export namespace UpdateBusinessDetailsErrors {
  const _context = 'UpdateBusinessDetailsErrors';

  export class HostDoesntExists extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Doesn't exist host with id ${id.toString()}`,
        context: _context,
      });
    }
  }
}
