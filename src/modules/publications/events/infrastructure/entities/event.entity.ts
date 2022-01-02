import { OmitType } from '@nestjs/swagger';
import { DateTime } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';
import { EventPlace } from '../../domain/value-objects/event-place.value';

export class EventOccurrencePersistence extends OmitType(EventOccurrence, [
  'dateTimeInit',
  'dateTimeEnd',
] as const) {
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
}

export class EventEntity extends PersistentEntity {
  publisher: string;
  name: string;
  description: string;
  categories: string[];

  place: EventPlace;

  collaborators: string[];
  multimedia: string;
  newOccurrences: EventOccurrencePersistence[];
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
}
