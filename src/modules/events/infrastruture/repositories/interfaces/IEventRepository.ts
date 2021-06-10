import { Event } from 'src/modules/events/domain/entities/event.entity';
import { PaginatedGetHostPublicationsResponse } from 'src/modules/events/presentation/controllers/getHostPublications/get-host-publications.controller';
import { GetRecentHostEventsResponse } from 'src/modules/events/presentation/controllers/getRecentHostEvents/response';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export interface IEventRepository extends IRepository<Event> {
  findById(id: UniqueEntityID | string): Promise<Event>;
  exists(id: UniqueEntityID | string): Promise<boolean>;

  //view repo
  getRecentsByHost(hostId: string): Promise<GetRecentHostEventsResponse[]>;
  getPaginatedPublications(
    hostId: string,
    from: number,
    size: number,
  ): Promise<PaginatedGetHostPublicationsResponse>;
}
