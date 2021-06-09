import { Inject, Injectable } from '@nestjs/common';
import { IHostRepository } from 'src/modules/hosts/infrastructure/interfaces/host.repository.interface';
import { BaseController } from 'src/shared/http/BaseController';
import { GetHostProfileRequest } from './request';
import { GetHostProfileResponse } from './response';

@Injectable()
export class GetHostProfileController extends BaseController<
  GetHostProfileRequest,
  GetHostProfileResponse
> {
  constructor(
    @Inject('IHostRepository') private _hostRepository: IHostRepository,
  ) {
    super('GetHostProfileController');
  }

  protected async executeImpl(
    req: GetHostProfileRequest,
  ): Promise<GetHostProfileResponse> {
    const profile = await this._hostRepository.getProfileByHostId(req.hostId);
    return profile;
  }
}
