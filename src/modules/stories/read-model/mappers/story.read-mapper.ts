import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { Stories, StoriesByHost } from '../../presentation/stories';
import {
  StoryReadByHostFromDBEntity,
  StoryReadFromDBEntity,
} from '../entities/story.read-entity';

export namespace StoriesReadMapper {
  export function toResponse(db: StoryReadFromDBEntity): Stories {
    return {
      user: db.user,
      stories: db.stories.map((r) => {
        if (!r.attachedText) delete r.attachedText;
        return {
          ...r,
          createdAt: parseDate(r.createdAt),
          viewed: !!r.viewed,
        };
      }),
    };
  }
  export function toResponseByHost(
    db: StoryReadByHostFromDBEntity,
  ): StoriesByHost {
    if (!db.attachedText) delete db.attachedText;
    return {
      ...db,
      createdAt: parseDate(db.createdAt),
    };
  }
}
