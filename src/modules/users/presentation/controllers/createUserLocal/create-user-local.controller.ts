import { Injectable } from '@nestjs/common';
import { CreateUserLocalUseCase } from 'src/modules/users/application/use-cases/create-user-local.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { CreateUserLocalRequest } from './request';
import { CreateUserLocalResponse } from './response';

@Injectable()
export class CreateUserLocalController extends BaseController<
  CreateUserLocalRequest,
  CreateUserLocalResponse
> {
  constructor(private useCase: CreateUserLocalUseCase) {
    super();
  }
  protected async executeImpl(
    req: CreateUserLocalRequest,
  ): Promise<CreateUserLocalResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.EmailExistsError:
          this.clientError(error.errorValue().message);
        default:
          this.fail(error.errorValue());
      }
    } else {
      return;
    }
  }
}
