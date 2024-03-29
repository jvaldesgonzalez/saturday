import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { IIdentifier } from 'src/shared/domain/Identifier';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Empty } from 'src/shared/typedefs/empty';

export class UserRef extends DomainEntity<Empty> {
  get id(): IIdentifier {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<UserRef> {
    return Ok(new UserRef(new UniqueEntityID(id)));
  }
}
