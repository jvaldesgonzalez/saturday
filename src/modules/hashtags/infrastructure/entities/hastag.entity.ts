import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class HashtagEntity extends PersistentEntity {
  word: string;
}
