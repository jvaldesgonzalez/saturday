import { Ok, Result } from 'src/shared/core/Result';
import { WatchedList } from 'src/shared/core/WatchedList';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Empty } from 'src/shared/typedefs/empty';

export class PlanMember extends DomainEntity<Empty> {
  get id(): UniqueEntityID {
    return this.id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<PlanMember> {
    return Ok(new PlanMember(new UniqueEntityID(id)));
  }
}

export class PlanMemberCollection extends WatchedList<PlanMember>{
  compareItems(a: PlanMember, b: PlanMember): boolean {
    return a.equals(b);
  }
}