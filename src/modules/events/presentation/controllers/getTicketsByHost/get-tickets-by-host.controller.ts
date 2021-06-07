import { Inject, Injectable } from '@nestjs/common';
import { IEventOccurrenceRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventOccurrenceRepository';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { PageParams } from 'src/shared/core/PaginatorParams';
import { BaseController } from 'src/shared/http/BaseController';
import { GetTicketsByHostRequest } from './request';
import { GetTicketsByHostResponse } from './response';

export type GetMyTicketsRequest = GetTicketsByHostRequest & PageParams;

@Injectable()
export class GetTicketsByHostController extends BaseController<
  GetTicketsByHostRequest & PageParams,
  PaginatedFindResult<GetTicketsByHostResponse>
> {
  constructor(
    @Inject('IEventOccurrenceRepository')
    private eventOccurrenceRepository: IEventOccurrenceRepository,
  ) {
    super();
  }
  protected async executeImpl(
    req: GetTicketsByHostRequest & PageParams,
  ): Promise<PaginatedFindResult<GetTicketsByHostResponse>> {
    return await this.eventOccurrenceRepository.getTicketsByHost(
      req.hostId,
      req.from,
      req.size,
    );
  }
}
