import { IPersistentEntity } from 'src/shared/core/interfaces/IPersistentEntity';

export abstract class PersistentEntity implements IPersistentEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
