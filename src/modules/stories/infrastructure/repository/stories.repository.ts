import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { IStoryRepository } from '../../application/interfaces/stories.repository.interface';
import { Story } from '../../domain/story.domain';
import { StoryEntity } from '../entities/story.entity';
import { StoryMapper } from '../mapper/stories.mapper';

export class StoryRepository
  extends BaseRepository<Story, StoryEntity>
  implements IStoryRepository
{
  constructor(
    @InjectPersistenceManager() readonly persistenceManager: PersistenceManager,
  ) {
    super(
      'Story',
      StoryMapper.toPersistence,
      'StoryRepository',
      persistenceManager,
    );
  }
  async findById(id: string): Promise<Story> {
    const res = await this.persistenceManager.maybeGetOne<StoryEntity>(
      QuerySpecification.withStatement(
        `
        MATCH (s:Story)<-[:PUBLISH_STORY]-(u:Partner)
        WHERE s.id = $id
        RETURN {
          id:s.id,
          publisher:u.id,
          type:s.type,
          url:s.url,
          createdAt:s.createdAt,
          updatedAt:s.updatedAt,
          attachedText:s.attachedText
        }
        `,
      )
        .bind({ id: id })
        .transform(StoryEntity),
    );
    return res ? StoryMapper.fromPersistence(res) : null;
  }

  async save(story: Story): Promise<void> {
    this._logger.log(`Save story with id: {${story._id}}`);
    const persistent = await this._domainToPersistentFunc(story);
    const { publisher, ...data } = persistent;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
        MATCH (p:Partner)
        WHERE p.id = $pId
        CREATE (s:Story)<-[edge:PUBLISH_STORY ]-(p)
        SET s += $data
        `,
      ).bind({
        pId: publisher,
        data,
      }),
    );
  }
}
