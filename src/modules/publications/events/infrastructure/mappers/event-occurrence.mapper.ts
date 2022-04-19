import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import {
  makeDate,
  parseDate,
} from 'src/shared/modules/data-access/neo4j/utils';
import { EventOccurrence } from '../../domain/event-occurrence.domain';
import { EventOccurrenceEntity } from '../entities/event-occurrence.entity';
import { OccurrenceTicketMapper } from './occurrence-ticket.mapper';

export namespace EventOccurrenceMapper {
  export function toPersistence(d: EventOccurrence): EventOccurrenceEntity {
    return {
      id: d._id.toString(),
      dateTimeInit: makeDate(d.dateTimeInit),
      dateTimeEnd: makeDate(d.dateTimeEnd),
      createdAt: makeDate(d.createdAt),
      updatedAt: makeDate(d.updatedAt),
      eventId: d.eventId.toString(),
      newTickets: d.newTickets.map(OccurrenceTicketMapper.toPersistence),
    };
  }

  export function fromPersistence(db: EventOccurrenceEntity): EventOccurrence {
    return EventOccurrence.create(
      {
        ...db,
        dateTimeInit: parseDate(db.dateTimeInit),
        dateTimeEnd: parseDate(db.dateTimeEnd),
        createdAt: parseDate(db.createdAt),
        updatedAt: parseDate(db.updatedAt),
        eventId: new UniqueEntityID(db.eventId),
        newTickets: [],
      },
      new UniqueEntityID(db.id),
    ).getValue();
  }
}
