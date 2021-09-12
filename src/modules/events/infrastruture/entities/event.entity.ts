import { Type } from 'class-transformer';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class UnknownFieldPersistent {
  header: string;
  body: string;
  inline: boolean;
}

class EventPlacePersistent {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  locationId: string;
  hostRef?: string;
}

export class MultimediaPersistent {
  type: string;
  url: string;
}

export class EventEntity extends PersistentEntity {
  publisher: string;
  name: string;
  description: string;
  categories: string[];

  @Type(() => EventPlacePersistent)
  place?: EventPlacePersistent;

  collaborators: string[];
  multimedia: string;

  attentionTags: string[];
}
