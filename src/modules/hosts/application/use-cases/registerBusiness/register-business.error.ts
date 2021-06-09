import {IUseCaseError} from "src/shared/core/interfaces/IUseCaseError";
import {Result} from "src/shared/core/Result";
import {UniqueEntityID} from "src/shared/domain/UniqueEntityID";

export namespace RegisterBusinessErrors {
  const _context = 'RegisterBusinessErrors';

  export class UserDoesntExists extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: UniqueEntityID | string) {
      super(false, {
        message: `Doesn't exist user with id ${id.toString()}`,
        context: _context,
      });
    }
  }
}
