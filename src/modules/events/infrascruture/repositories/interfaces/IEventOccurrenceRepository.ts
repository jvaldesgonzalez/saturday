import { EventOccurrence } from 'src/modules/events/domain/entities/event-ocurrency.entity';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { IIdentifier } from 'src/shared/domain/Identifier';

export interface IEventOccurrenceRepository
  extends IRepository<EventOccurrence> {
  findById(id: IIdentifier | string): Promise<EventOccurrence>;
  exists(id: IIdentifier | string): Promise<boolean>;
}
