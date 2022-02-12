import { DateTime } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';
import { EventPlace } from '../../domain/value-objects/event-place.value';
import { EventOccurrenceEntity } from './event-occurrence.entity';

export class EventEntity extends PersistentEntity {
  publisher: string;
  name: string;
  description: string;
  category: string;
  topPrice: number;
  basePrice: number;
  place: EventPlace;
  collaborators: string[];
  multimedia: string;
  newOccurrences: EventOccurrenceEntity[];
  dateTimeInit: DateTime<number>;
  dateTimeEnd: DateTime<number>;
  hashtags: string[];
}
