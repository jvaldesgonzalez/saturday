import { Injectable } from '@nestjs/common';
import { CreateUserWithProviderUseCase } from 'src/modules/users/application/use-cases/create-user-withprovider.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { CreateUserProviderRequest } from './request';
import { CreateUserProviderResponse } from './response';

@Injectable()
export class CreateUserProviderController extends BaseController<
  CreateUserProviderRequest,
  CreateUserProviderResponse
> {
  constructor(private useCase: CreateUserWithProviderUseCase) {
    super();
  }
  protected async executeImpl(
    req: CreateUserProviderRequest,
  ): Promise<CreateUserProviderResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.EmailExistsError:
          this.clientError(error.errorValue().message);
        default:
          console.log(error.errorValue());
          this.clientError(error.errorValue());
      }
    } else {
      return;
    }
  }
}
