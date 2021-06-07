import { EventOccurrence } from 'src/modules/events/domain/entities/event-ocurrency.entity';
import { GetTicketsByHostResponse } from 'src/modules/events/presentation/controllers/getTicketsByHost/response';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';

export interface IEventOccurrenceRepository
  extends IRepository<EventOccurrence> {
  //findById(id: IIdentifier | string): Promise<EventOccurrence>;
  //exists(id: IIdentifier | string): Promise<boolean>;

  //view repo
  getTicketsByHost(
    hostId: string,
    from: number,
    len: number,
  ): Promise<PaginatedFindResult<GetTicketsByHostResponse>>;
}