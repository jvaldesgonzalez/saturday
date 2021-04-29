import { Ok, Result } from 'src/shared/core/Result';
import { WatchedList } from 'src/shared/core/WatchedList';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Empty } from './publisherRef.entity';

export class CategoryRef extends DomainEntity<Empty> {
  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<CategoryRef> {
    return Ok(new CategoryRef(id));
  }
}

export class CategoryRefCollection extends WatchedList<CategoryRef> {
  private constructor(initialCats: CategoryRef[]) {
    super(initialCats);
  }

  public compareItems(a: CategoryRef, b: CategoryRef): boolean {
    return a.equals(b);
  }

  public static create(initialTags?: CategoryRef[]): CategoryRefCollection {
    return new CategoryRefCollection(initialTags ? initialTags : []);
  }
}
