import { DateTime } from 'neo4j-driver-core';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { Event } from '../../domain/event.domain';
import { EventDescription } from '../../domain/value-objects/event-description.value';
import { EventEntity } from '../entities/event.entity';
import { EventOccurrenceMapper } from './event-occurrence.mapper';

export namespace EventMapper {
  export function toPersistence(d: Event): EventEntity {
    return {
      dateTimeInit: DateTime.fromStandardDate(d.dateTimeInit),
      dateTimeEnd: DateTime.fromStandardDate(d.dateTimeEnd),
      createdAt: DateTime.fromStandardDate(d.createdAt),
      updatedAt: DateTime.fromStandardDate(d.updatedAt),
      publisher: d.publisher.toString(),
      description: JSON.stringify(d.description),
      multimedia: JSON.stringify(d.multimedia),
      id: d._id.toString(),
      category: d.category.toString(),
      name: d.name,
      place: d.place,
      collaborators: d.collaborators.map((c) => c.toString()),
      newOccurrences: d.newOccurrences.map(EventOccurrenceMapper.toPersistence),
      topPrice: d.topPrice,
      basePrice: d.basePrice,
      hashtags: d.hashtags,
    };
  }

  export function fromPersistence(db: EventEntity): Event {
    return Event.create(
      {
        ...db,
        multimedia: JSON.parse(db.multimedia),
        publisher: new UniqueEntityID(db.publisher),
        description: TextUtils.escapeAndParse(
          db.description,
        ) as EventDescription,
        category: new UniqueEntityID(db.category),
        collaborators: db.collaborators.map((c) => new UniqueEntityID(c)),
        createdAt: parseDate(db.createdAt),
        updatedAt: parseDate(db.updatedAt),
        dateTimeInit: parseDate(db.dateTimeInit),
        dateTimeEnd: parseDate(db.dateTimeEnd),
        newOccurrences: [],
        topPrice: db.topPrice,
        basePrice: db.basePrice,
        hashtags: db.hashtags,
      },
      new UniqueEntityID(db.id),
    ).getValue();
  }
}
