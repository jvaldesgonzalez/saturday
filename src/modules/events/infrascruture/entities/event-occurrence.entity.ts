import { Type } from 'class-transformer';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';
import { TicketEntity } from './ticket.entity';

export class EventOccurrenceEntity extends PersistentEntity {
  dateTimeInit: string;
  dateTimeEnd: string;
  eventId: string;

  @Type(() => TicketEntity)
  tickets: TicketEntity[];
}
