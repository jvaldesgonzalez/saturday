import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { Event } from '../../domain/event.domain';

export interface IEventRepository extends IRepository<Event> {}
