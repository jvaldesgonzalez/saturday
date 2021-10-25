import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class CategoryEntity extends PersistentEntity {
  name: string;
  description: string;
  active: boolean;
  imageUrl: string;
  parentCategory?: string;
}
