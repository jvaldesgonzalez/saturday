import { Collection } from 'src/modules/events/domain/entities/collection.entity';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { PaginatedGetHostPublicationsResponse } from 'src/modules/events/presentation/controllers/getHostPublications/get-host-publications.controller';
import { GetRecentHostEventsResponse } from 'src/modules/events/presentation/controllers/getRecentHostEvents/response';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export interface IEventRepository extends IRepository<Event> {
  findById(id: UniqueEntityID | string): Promise<Event>;
  exists(id: UniqueEntityID | string): Promise<boolean>;

  //collections
  findCollectionById(id: UniqueEntityID | string): Promise<Collection>;
  saveCollection(collection: Collection): Promise<void>;
  dropCollection(collection: Collection): Promise<void>;

  //view repo
  getRecentsByHost(hostId: string): Promise<GetRecentHostEventsResponse[]>;
  getPaginatedPublications(
    hostId: string,
    from: number,
    size: number,
  ): Promise<PaginatedGetHostPublicationsResponse>;
}
