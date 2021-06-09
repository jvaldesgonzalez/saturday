import { Inject, Injectable } from '@nestjs/common';
import { IEventOccurrenceRepository } from 'src/modules/events/infrastruture/repositories/interfaces/IEventOccurrenceRepository';
import { PageParams } from 'src/shared/core/PaginatorParams';
import { BaseController } from 'src/shared/http/BaseController';
import { GetTicketsByOccurrenceRequest } from './request';
import { GetTicketsByOccurrenceResponse } from './response';

export type GetMyTicketsRequest = GetTicketsByOccurrenceRequest & PageParams;

@Injectable()
export class GetTicketsByOccurrenceController extends BaseController<
  GetTicketsByOccurrenceRequest,
  GetTicketsByOccurrenceResponse
> {
  constructor(
    @Inject('IEventOccurrenceRepository')
    private eventOccurrenceRepository: IEventOccurrenceRepository,
  ) {
    super();
  }
  protected async executeImpl(
    req: GetTicketsByOccurrenceRequest,
  ): Promise<GetTicketsByOccurrenceResponse> {
    return await this.eventOccurrenceRepository.getTicketsByOccurrence(
      req.occurrenceId,
    );
  }
}
