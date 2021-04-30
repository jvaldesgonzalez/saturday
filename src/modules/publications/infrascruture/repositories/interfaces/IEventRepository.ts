import { Event } from 'src/modules/publications/domain/entities/event.entity';
import { IRepository } from 'src/shared/core/interfaces/IRepository';

export type IEventRepository = IRepository<Event>;
