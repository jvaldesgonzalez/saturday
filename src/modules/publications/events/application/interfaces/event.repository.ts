import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Event } from '../../domain/event.domain';

export interface IEventRepository extends IRepository<Event> {
  findById(theEventId: UniqueEntityID): Promise<Event>;
  findPublisherFollowers(theFolloweeId: string): Promise<string[]>;
}
