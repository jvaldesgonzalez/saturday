import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class MultimediaEntity {}

export class StoryEntity extends PersistentEntity {
  publisher: string;
  type: string;
  url: string;
  attachedText?: string;
}
