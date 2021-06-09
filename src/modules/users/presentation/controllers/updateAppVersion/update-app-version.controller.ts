import { Injectable } from '@nestjs/common';
import { UpdateAppVersionUseCase } from 'src/modules/users/application/use-cases/update-app-version';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { UpdateAppVersionRequest } from './request';
import { UpdateAppVersionResponse } from './response';

@Injectable()
export class UpdateAppVersionController extends BaseController<
  UpdateAppVersionRequest,
  UpdateAppVersionResponse
> {
  constructor(private useCase: UpdateAppVersionUseCase) {
    super();
  }
  protected async executeImpl(
    req: UpdateAppVersionRequest,
  ): Promise<UpdateAppVersionResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.UserDoesntExists:
          this.notFound(error.errorValue().message);
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
