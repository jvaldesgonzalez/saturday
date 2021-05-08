import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class AttentionTagEntity extends PersistentEntity {
  title: string;
  color: string;
  description: string;
}
