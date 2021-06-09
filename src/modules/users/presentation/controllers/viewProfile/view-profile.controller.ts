import { Injectable } from '@nestjs/common';
import { ViewProfileUseCase } from 'src/modules/users/application/use-cases/view-profile.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { ViewProfileRequest } from './request';
import { ViewProfileResponse } from './response';

@Injectable()
export class ViewProfileController extends BaseController<
  ViewProfileRequest,
  ViewProfileResponse
> {
  constructor(private useCase: ViewProfileUseCase) {
    super();
  }
  protected async executeImpl(
    req: ViewProfileRequest,
  ): Promise<ViewProfileResponse> {
    const result = await this.useCase.execute(req);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.UserDoesntExists:
          this.notFound(error.errorValue().message);
          break;

        default:
          this.fail(error.errorValue().message);
          break;
      }
    }
    if (result.isRight()) {
      const user = result.value.getValue();
      return {
        email: user.email.value,
        profileImageUrl: user.profileImageUrl.value,
        username: user.username.value,
      };
    }
  }
}
