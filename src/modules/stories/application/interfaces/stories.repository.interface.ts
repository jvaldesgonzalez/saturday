import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { IIdentifier } from 'src/shared/domain/Identifier';
import { Story } from '../../domain/story.domain';

export interface IStoryRepository extends IRepository<Story> {
  findById(id: string | IIdentifier): Promise<Story>;
}
