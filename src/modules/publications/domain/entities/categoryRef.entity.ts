import { Ok, Result } from 'src/shared/core/Result';
import { WatchedList } from 'src/shared/core/WatchedList';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Empty } from './publisherRef.entity';

export class CategoryRef extends DomainEntity<Empty> {
  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<CategoryRef> {
    return Ok(new CategoryRef(new UniqueEntityID(id)));
  }
}

export class CategoryRefCollection extends WatchedList<CategoryRef> {
  public compareItems(a: CategoryRef, b: CategoryRef): boolean {
    return a.equals(b);
  }
}
