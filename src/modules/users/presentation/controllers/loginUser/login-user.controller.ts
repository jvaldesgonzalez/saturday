import { Injectable } from '@nestjs/common';
import { LoginUserUseCase } from 'src/modules/users/application/use-cases/login-user.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { LoginUserRequest } from './request';
import { LoginUserResponse } from './response';

@Injectable()
export class LoginUserController extends BaseController<
  LoginUserRequest,
  LoginUserResponse
> {
  constructor(private useCase: LoginUserUseCase) {
    super();
  }
  protected async executeImpl(
    req: LoginUserRequest,
  ): Promise<LoginUserResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.UserWithEmailOrUsernameDoesNotExist:
          this.clientError(error.errorValue());
          break;
        case UserErrors.WrongPassword:
          this.unauthorized(error.errorValue());
        default:
          console.log(error);
          this.clientError(error.errorValue());
      }
    }
    if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
