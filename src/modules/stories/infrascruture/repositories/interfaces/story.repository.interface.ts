import { Story } from 'src/modules/stories/domain/entities/story.entity';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { IIdentifier } from 'src/shared/domain/Identifier';

export interface IStoryRepository extends IRepository<Story> {
  findById(id: string | IIdentifier): Promise<Story>;
}
