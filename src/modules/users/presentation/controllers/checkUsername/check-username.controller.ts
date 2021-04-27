import { Injectable } from '@nestjs/common';
import { CheckUsernameUseCase } from 'src/modules/users/application/use-cases/check-username.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { CheckUsernameRequest } from './request';
import { CheckUsernameResponse } from './response';

@Injectable()
export class CHeckUsernameController extends BaseController<
  CheckUsernameRequest,
  CheckUsernameResponse
> {
  constructor(private useCase: CheckUsernameUseCase) {
    super();
  }
  protected async executeImpl(
    req: CheckUsernameRequest,
  ): Promise<CheckUsernameResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.UsernameExistsError:
          this.clientError(error.errorValue().message);
          break;

        default:
          this.fail(error.errorValue());
      }
    }
    if (result.isRight()) {
      return;
    }
  }
}
