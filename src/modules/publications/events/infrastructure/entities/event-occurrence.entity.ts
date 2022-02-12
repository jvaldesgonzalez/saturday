import { DateTime } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class EventOccurrenceEntity extends PersistentEntity {
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
  eventId: string;
  newTickets: OccurrenceTicketEntity[];
}

export class OccurrenceTicketEntity extends PersistentEntity {
  price: number;
  name: string;
  amount: number;
  description: string;
}
