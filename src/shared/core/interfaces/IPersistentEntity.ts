import { DateTime } from 'neo4j-driver';

export interface IPersistentEntity {
  id: string | number;
  createdAt: DateTime<number>;
  updatedAt: DateTime<number>;
}
