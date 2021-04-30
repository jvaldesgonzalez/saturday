import { Event } from 'src/modules/publications/domain/entities/event.entity';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export interface IEventRepository extends IRepository<Event> {
  findById(id: UniqueEntityID | string): Promise<Event>;
}
