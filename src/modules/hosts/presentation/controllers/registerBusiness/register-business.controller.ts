import { Injectable } from '@nestjs/common';
import { RegisterBusinessErrors } from 'src/modules/hosts/application/use-cases/registerBusiness/register-business.error';
import { RegisterBusinessUseCase } from 'src/modules/hosts/application/use-cases/registerBusiness/register-business.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { RegisterBusinessRequest } from './request';
import { RegisterBusinessResponse } from './response';

@Injectable()
export class RegisterBusinessController extends BaseController<
  RegisterBusinessRequest,
  RegisterBusinessResponse
> {
  constructor(private useCase: RegisterBusinessUseCase) {
    super();
  }

  protected async executeImpl(
    req: RegisterBusinessRequest,
  ): Promise<RegisterBusinessResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case RegisterBusinessErrors.UserDoesntExists:
          this.notFound(error.errorValue().message);
          break;
        default:
          this.fail(error.errorValue());
      }
    } else {
      return;
    }
  }
}
