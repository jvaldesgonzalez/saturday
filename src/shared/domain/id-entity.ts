import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Empty } from 'src/shared/typedefs/empty';

export class IdEntity extends DomainEntity<Empty> {
  get id(): UniqueEntityID {
    return this.id;
  }

  protected constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<IdEntity> {
    return Ok(new IdEntity(new UniqueEntityID(id)));
  }
}
