import { DateTime } from 'neo4j-driver';
import { IPersistentEntity } from 'src/shared/core/interfaces/IPersistentEntity';

export abstract class PersistentEntity implements IPersistentEntity {
  id: string;
  createdAt: DateTime<number>;
  updatedAt: DateTime<number>;
}
