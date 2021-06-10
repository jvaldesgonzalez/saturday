import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventRepository';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { PageParams } from 'src/shared/core/PaginatorParams';
import { BaseController } from 'src/shared/http/BaseController';
import { GetRecentHostEventsRequest } from '../getRecentHostEvents/request';
import { GetHostPublicationsResponse } from './response';

export type PagedGetHostPublicationsRequest = GetRecentHostEventsRequest &
  PageParams;

export type PaginatedGetHostPublicationsResponse = PaginatedFindResult<GetHostPublicationsResponse>;

@Injectable()
export class GetHostPublicationsController extends BaseController<
  PagedGetHostPublicationsRequest,
  PaginatedGetHostPublicationsResponse
> {
  constructor(
    @Inject('IEventRepository') private _eventRepository: IEventRepository,
  ) {
    super();
  }
  protected async executeImpl(
    req: PagedGetHostPublicationsRequest,
  ): Promise<PaginatedGetHostPublicationsResponse> {
    return await this._eventRepository.getPaginatedPublications(
      req.hostId,
      req.from,
      req.size,
    );
  }
}
