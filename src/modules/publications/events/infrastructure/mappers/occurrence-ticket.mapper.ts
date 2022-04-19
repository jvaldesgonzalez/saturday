import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import {
  makeDate,
  parseDate,
} from 'src/shared/modules/data-access/neo4j/utils';
import { OccurrenceTicket } from '../../domain/occurrence-ticket.domain';
import { OccurrenceTicketEntity } from '../entities/event-occurrence.entity';

export namespace OccurrenceTicketMapper {
  export function toPersistence(d: OccurrenceTicket): OccurrenceTicketEntity {
    return {
      name: d.name,
      id: d._id.toString(),
      createdAt: makeDate(d.createdAt),
      updatedAt: makeDate(d.updatedAt),
      amount: d.amount,
      description: d.description,
      price: d.price,
    };
  }

  export function fromPersistence(
    db: OccurrenceTicketEntity,
  ): OccurrenceTicket {
    return OccurrenceTicket.create(
      {
        ...db,
        createdAt: parseDate(db.createdAt),
        updatedAt: parseDate(db.updatedAt),
      },
      new UniqueEntityID(db.id),
    ).getValue();
  }
}
