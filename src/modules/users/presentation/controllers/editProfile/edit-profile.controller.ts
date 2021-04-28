import { Injectable } from '@nestjs/common';
import { UpdateProfileUseCase } from 'src/modules/users/application/use-cases/update-profile.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { EditProfileRequest } from './request';
import { EditProfileResponse } from './response';

@Injectable()
export class EditProfileController extends BaseController<
  EditProfileRequest,
  EditProfileResponse
> {
  constructor(private useCase: UpdateProfileUseCase) {
    super();
  }
  protected async executeImpl(
    req: EditProfileRequest,
  ): Promise<EditProfileResponse> {
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
