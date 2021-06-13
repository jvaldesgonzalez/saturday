import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class CollectionEntity extends PersistentEntity {
  publisher: string;
  events: string[];
  name: string;
  description: string;
}
