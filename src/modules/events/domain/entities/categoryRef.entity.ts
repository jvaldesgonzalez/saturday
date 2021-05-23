import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { IIdentifier } from 'src/shared/domain/Identifier';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Empty } from './publisherRef.entity';

export class CategoryRef extends DomainEntity<Empty> {
  get id(): IIdentifier {
    return this._id;
  }
  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<CategoryRef> {
    return Ok(new CategoryRef(new UniqueEntityID(id)));
  }
}

export type CategoryRefCollection = CategoryRef[];
