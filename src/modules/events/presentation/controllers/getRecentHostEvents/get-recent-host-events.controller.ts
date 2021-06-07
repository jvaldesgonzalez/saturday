import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from 'src/modules/events/infrascruture/repositories/interfaces/IEventRepository';
import { BaseController } from 'src/shared/http/BaseController';
import { GetRecentHostEventsRequest } from './request';
import { GetRecentHostEventsResponse } from './response';

@Injectable()
export class GetRecentEventsByHostController extends BaseController<
  GetRecentHostEventsRequest,
  GetRecentHostEventsResponse[]
> {
  constructor(
    @Inject('IEventRepository') private _eventRepository: IEventRepository,
  ) {
    super();
  }
  protected async executeImpl(
    req: GetRecentHostEventsRequest,
  ): Promise<GetRecentHostEventsResponse[]> {
    return await this._eventRepository.getRecentsByHost(req.hostId);
  }
}
