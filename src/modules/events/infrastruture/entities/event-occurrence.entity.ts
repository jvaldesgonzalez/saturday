import { Type } from 'class-transformer';
import { DateTime } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';
import { TicketEntity } from './ticket.entity';

export class EventOccurrenceEntity extends PersistentEntity {
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
  eventId: string;

  @Type(() => TicketEntity)
  tickets: TicketEntity[];
}
