import { Injectable } from '@nestjs/common';
import { UpdateFirebasePushIdUseCase } from 'src/modules/users/application/use-cases/update-firebase-id';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { UpdateFirebasePushIdRequest } from './request';
import { UpdateFirebasePushIdResponse } from './response';

@Injectable()
export class UpdateFirebasePushIdController extends BaseController<
  UpdateFirebasePushIdRequest,
  UpdateFirebasePushIdResponse
> {
  constructor(private useCase: UpdateFirebasePushIdUseCase) {
    super();
  }
  protected async executeImpl(
    req: UpdateFirebasePushIdRequest,
  ): Promise<UpdateFirebasePushIdResponse> {
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
