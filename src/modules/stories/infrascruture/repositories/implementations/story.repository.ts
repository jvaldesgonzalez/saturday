import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Story } from 'src/modules/stories/domain/entities/story.entity';
import { GetStoriesFromHostResponse } from 'src/modules/stories/presentation/controllers/getStoriesFromHost/response';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { StoryEntity } from '../../entities/story.entity';
import { StoryMapper } from '../../mapper/story.mapper';
import { IStoryRepository } from '../interfaces/story.repository.interface';
// import * as faker from 'faker';

export class StoryRepository
  extends BaseRepository<Story, StoryEntity>
  implements IStoryRepository {
  constructor(
    @InjectPersistenceManager() readonly persistenceManager: PersistenceManager,
  ) {
    super(
      'Story',
      StoryMapper.DomainToPersistent,
      'StoryRepository',
      persistenceManager,
    );
  }
  async findById(id: string): Promise<Story> {
    const res = await this.persistenceManager.maybeGetOne<StoryEntity>(
      QuerySpecification.withStatement(
        `
        MATCH (m:Multimedia)<-[:CONTAINS_MEDIA]- (s:Story) -[:PUBLISHED_BY]->(u:User)
        WHERE s.id = $id
        RETURN {
          id:s.id,
          publisher:u.id,
          multimedia:m,
          createdAt:s.createdAt,
          updatedAt:s.updatedAt,
          attachedText:s.attachedText
        }
        `,
      )
        .bind({ id: id })
        .transform(StoryEntity),
    );
    return res ? StoryMapper.PersistentToDomain(res) : null;
  }

  async save(story: Story): Promise<void> {
    this._logger.log(`Save story with id: {${story._id}}`);
    const persistent = await this._domainToPersistentFunc(story);
    const { multimedia, publisher, ...storyRaw } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
        MATCH (u:User)
        WHERE u.id = $publisher
        CREATE (s:Story)<-[edge:PUBLISH_STORY ]-(u)
        SET s += $story
        SET edge+= $edge
        `,
      ).bind({
        publisher: publisher,
        story: { url: multimedia.url, ...storyRaw },
        edge: { type: multimedia.type },
      }),
    );
  }

  async delete(story: Story): Promise<void> {
    this._logger.log(`Drop entity with id: {${story._id}}`);
    await this.persistenceManager.execute(
      QuerySpecification.withStatement<void>(
        `
        MATCH (n:Story)-[:CONTAINS_MEDIA]->(m:Multimedia)
        WHERE n.id = $id
        DETACH DELETE n
        DETACH DELETE m
        `,
      ).bind({ id: story._id.toString() }),
    );
  }

  //view part
  async getByHost(hostId: string): Promise<GetStoriesFromHostResponse[]> {
    const stories = await this.persistenceManager.query<GetStoriesFromHostResponse>(
      QuerySpecification.withStatement<GetStoriesFromHostResponse>(
        `
        MATCH (s:Story)<-[edge:PUBLISH_STORY ]-(u:User)
        WHERE u.id = $id
        RETURN {
          id:s.id,
          type:edge.type,
          url:s.url,
          views:0
        }
        `,
      ).bind({ id: hostId }),
    );

    return stories;
  }
}
