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
import * as faker from 'faker';

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
    this._logger.log(`Save entity with id: {${story._id}}`);
    const persistent = await this._domainToPersistentFunc(story);
    const { multimedia, publisher, ...storyRaw } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
        MATCH (u:User)
        WHERE u.id = $publisher
        MERGE (m:Multimedia)<-[:CONTAINS_MEDIA]-(s:Story)-[:PUBLISHED_BY]->(u)
        SET m += $multimedia
        SET s += $story
        `,
      ).bind({
        publisher: publisher,
        multimedia: multimedia,
        story: storyRaw,
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
    const arr = Array(faker.datatype.number(10));
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        id: faker.datatype.uuid(),
        type: 'image',
        url: faker.image.imageUrl(),
        views: faker.datatype.number(10000),
      };
    }
    return arr;
  }
}
