import { Ok, Result } from 'src/shared/core/Result';
import { WatchedList } from 'src/shared/core/WatchedList';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Empty } from './publisherRef.entity';

export class EventRef extends DomainEntity<Empty> {
  get id(): UniqueEntityID {
    return this.id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<EventRef> {
    return Ok(new EventRef(new UniqueEntityID(id)));
  }
}

export class EventRefCollection extends WatchedList<EventRef> {
  compareItems(a: EventRef, b: EventRef): boolean {
    return a.equals(b);
  }
}
