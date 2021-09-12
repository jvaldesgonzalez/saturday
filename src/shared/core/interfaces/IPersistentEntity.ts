import { DateTime } from 'neo4j-driver';

export interface IPersistentEntity {
  id: string | number;
  createdAt: Date | DateTime<number> | any;
  updatedAt: Date | DateTime<number> | any;
}
