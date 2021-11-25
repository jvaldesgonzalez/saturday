import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { IIdentifier } from 'src/shared/domain/Identifier';

export namespace DeleteStoryErrors {
  const context = 'DeleteStoryErrors';

  export class StoryNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(id: IIdentifier) {
      super(false, {
        message: `Doesn't exist story with id ${id.toString()}`,
        context,
      });
    }
  }
}
