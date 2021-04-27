import { Injectable } from '@nestjs/common';
import { RefreshTokenUseCase } from 'src/modules/users/application/use-cases/refresh-token.usecase';
import { UserErrors } from 'src/modules/users/domain/errors/user.errors';
import { BaseController } from 'src/shared/http/BaseController';
import { RefreshTokenRequest } from './request';
import { RefreshTokenResponse } from './response';

@Injectable()
export class RefreshTokenController extends BaseController<
  RefreshTokenRequest,
  RefreshTokenResponse
> {
  constructor(private useCase: RefreshTokenUseCase) {
    super();
  }
  protected async executeImpl(
    req: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const result = await this.useCase.execute(req);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserErrors.UserDoesntExists:
          this.notFound(error.errorValue().message);
          break;
        case UserErrors.InvalidSignature:
          this.unauthorized(error.errorValue().message);
          break;
        default:
          this.fail(error.errorValue());
      }
    }
    if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
