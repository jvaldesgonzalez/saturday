import { Injectable } from '@nestjs/common';
import { UpdateBusinessDetailsErrors } from 'src/modules/hosts/application/use-cases/updateBusinessDetails/update-business-details.error';
import { UpdateBusinessDetailsUseCase } from 'src/modules/hosts/application/use-cases/updateBusinessDetails/update-business-details.usecase';
import { BaseController } from 'src/shared/http/BaseController';
import { UpdateBusinessDetailsRequest } from './request';
import { UpdateBusinessDetailsResponse } from './response';

@Injectable()
export class UpdateBusinessDetailsController extends BaseController<
  UpdateBusinessDetailsRequest,
  UpdateBusinessDetailsResponse
> {
  constructor(private useCase: UpdateBusinessDetailsUseCase) {
    super('UpdateBusinessDetailsController');
  }

  protected async executeImpl(
    req: UpdateBusinessDetailsRequest,
  ): Promise<UpdateBusinessDetailsResponse> {
    const result = await this.useCase.execute(req);
    this._logger.log(JSON.stringify(result));
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UpdateBusinessDetailsErrors.HostDoesntExists:
          this.notFound(error.errorValue().message);
          break;
        default:
          this.fail(error.errorValue().message);
      }
    } else {
      return;
    }
  }
}
