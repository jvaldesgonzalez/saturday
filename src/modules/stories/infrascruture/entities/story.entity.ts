import { Type } from 'class-transformer';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class MultimediaEntity {
  type: string;
  url: string;
}

export class StoryEntity extends PersistentEntity {
  publisher: string;

  @Type(() => MultimediaEntity)
  multimedia: MultimediaEntity;

  attachedText: string;
}
