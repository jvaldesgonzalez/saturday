import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Stories } from './presentation/stories';

@Injectable()
export class StoriesReadService {
  constructor(
    @InjectPersistenceManager() private persisitenceManager: PersistenceManager,
  ) {}

  async getStories(userId: string): Promise<Stories[]> {
    return await this.persisitenceManager.query<Stories>(
      QuerySpecification.withStatement(
        `
				MATCH (n:Partner)--(s:Story)
				RETURN {
					id:n.id,
					username:n.username,
					avatar:n.avatar,
					stories:collect(s {.type , .url, .id})
			}
			`,
      ).transform(Stories),
    );
  }
}
