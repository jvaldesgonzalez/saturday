import { EventListItemReadEntity } from '../entities/event-list-item.entity';

export interface IEventStats {
  getEventStatsListByPartner(
    thePartnerId: string,
    skip: number,
    limit: number,
  ): Promise<EventListItemReadEntity[]>;

  // getEventStatsDetails(theEventId: string): Promise<any>;
}
