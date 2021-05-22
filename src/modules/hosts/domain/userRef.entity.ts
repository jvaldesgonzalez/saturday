import { Empty } from 'src/modules/publications/domain/entities/publisherRef.entity';
import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export class UserRef extends DomainEntity<Empty> {
  get id(): UniqueEntityID {
    return this.id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<UserRef> {
    return Ok(new UserRef(new UniqueEntityID(id)));
  }
}
