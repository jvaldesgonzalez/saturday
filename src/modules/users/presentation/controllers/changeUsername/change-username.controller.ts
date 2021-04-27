import { Injectable } from '@nestjs/common';
import { ChangeUsernameUseCase } from 'src/modules/users/application/use-cases/change-username.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { ChangeUsernameRequest } from './request';
import { ChangeUsernameResponse } from './response';

@Injectable()
export class ChangeUsernameController extends BaseController<
  ChangeUsernameRequest,
  ChangeUsernameResponse
> {
  constructor(private useCase: ChangeUsernameUseCase) {
    super();
  }
  protected async executeImpl(
    req: ChangeUsernameRequest,
  ): Promise<ChangeUsernameResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.UserDoesntExists:
          this.notFound(error.errorValue().message);
          break;

        case UserErrors.UsernameExistsError:
          this.clientError(error.errorValue().message);

        default:
          this.fail(error.errorValue());
      }
    }
    if (result.isRight()) {
      return;
    }
  }
}
