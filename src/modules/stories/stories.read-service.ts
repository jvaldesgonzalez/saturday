import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { Stories, StoriesByHost } from './presentation/stories';
import { StoriesReadMapper } from './read-model/mappers/story.read-mapper';

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
				WITH n,s
				ORDER BY s.createdAt DESC
				OPTIONAL MATCH (u:User)--(s)
				WHERE u.id = $uId
				WITH collect(apoc.map.merge(s {.type, .url, .id, .createdAt, .attachedText},{viewed:u.username})) as stories, n
				RETURN {
					user:{
						id:n.id,
						username:n.username,
						avatar:n.avatar
					},
					stories:stories
				} as result
			`,
      )
        .bind({ uId: userId })
        .map(StoriesReadMapper.toResponse)
        .transform(Stories),
    );
    items.forEach((s) =>
      s.stories.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)),
    );
    items.sort((_a, b) => (b.stories.every((story) => story.viewed) ? -1 : +1));

    return {
      items,
      total: 5,
      pageSize: 5,
      current: 0,
    };
  }

  async getStoriesByHost(hostId: string): Promise<StoriesByHost[]> {
    return await this.persisitenceManager.query<StoriesByHost>(
      QuerySpecification.withStatement(
        `
				MATCH (s:Story)<-[:PUBLISH_STORY ]-(p:Partner)
        WHERE p.id = $id
				OPTIONAL MATCH (s)--(u:User)
        RETURN {
          id:s.id,
          type:s.type,
          url:s.url,
          attachedText: s.attachedText,
          views:count(u),
					createdAt:s.createdAt
        }
        `,
      )
        .bind({ id: hostId })
        .map(StoriesReadMapper.toResponseByHost)
        .transform(StoriesByHost),
    );
  }
}
