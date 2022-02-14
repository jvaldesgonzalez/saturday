import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { EventDetailsReadEntity } from '../entities/event-details.entity';
import { EventListItemReadEntity } from '../entities/event-list-item.entity';
import { EventOccurrenceDetailsReadEntity } from '../entities/event-occurrence-details.entity';

export interface IEventStats {
  getEventStatsListByPartner(
    thePartnerId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventListItemReadEntity>>;

  getEventStatsDetails(
    theEventId: string,
    thePartnerId: string,
  ): Promise<EventDetailsReadEntity>;

  getOccurrencesDetails(
    theEventId: string,
    thePartnerId: string,
  ): Promise<{ occurrences: EventOccurrenceDetailsReadEntity[] }>;
}
