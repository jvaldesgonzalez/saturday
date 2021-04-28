import { Injectable } from '@nestjs/common';
import { ChangePasswordUseCase } from 'src/modules/users/application/use-cases/change-password';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { ChangePasswordRequest } from './request';
import { ChangePasswordResponse } from './response';

@Injectable()
export class ChangePasswordController extends BaseController<
  ChangePasswordRequest,
  ChangePasswordResponse
> {
  constructor(private useCase: ChangePasswordUseCase) {
    super();
  }
  protected async executeImpl(
    req: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.UserDoesntExists:
          this.notFound(error.errorValue().message);
          break;

        case UserErrors.WrongPassword:
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
