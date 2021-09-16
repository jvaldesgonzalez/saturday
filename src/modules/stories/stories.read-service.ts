import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { Stories } from './presentation/stories';

@Injectable()
export class StoriesReadService {
  constructor(
    @InjectPersistenceManager() private persisitenceManager: PersistenceManager,
  ) {}

  async getStories(userId: string): Promise<PaginatedFindResult<Stories>> {
    const items = await this.persisitenceManager.query<Stories>(
      QuerySpecification.withStatement(
        `
				MATCH (n:Partner)--(s:Story)
				RETURN {
					id:n.id,
					username:n.username,
					avatar:n.avatar,
					stories:collect(s {.type , .url, .id, .createdAt, .attachedText})
			}
			`,
      )
        .map((r) => {
          return {
            ...r,
            stories: r.stories.map((s) => {
              const result = {
                ...s,
                createdAt: parseDate(s.createdAt),
              };
              if (!result.attachedText) delete result.attachedText;
              return result;
            }),
          };
        })
        .transform(Stories),
    );

    return {
      items,
      total: 5,
      pageSize: 5,
      current: 0,
    };
  }
}
