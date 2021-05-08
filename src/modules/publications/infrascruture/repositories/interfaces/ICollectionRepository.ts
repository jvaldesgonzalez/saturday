import { Collection } from 'src/modules/publications/domain/entities/collection.entity';
import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { IIdentifier } from 'src/shared/domain/Identifier';

export interface ICollectionRepository extends IRepository<Collection> {
  findById(id: string | IIdentifier): Promise<Collection>;
}
