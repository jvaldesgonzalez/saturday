import { Ok, Result } from 'src/shared/core/Result';
import {AggregateDomainEntity} from 'src/shared/domain/aggregate-entity.abstract';
import {IIdentifier} from 'src/shared/domain/Identifier';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import {Empty} from 'src/shared/typedefs/empty';

export class AttentionTagRef extends AggregateDomainEntity<Empty> {
  get id(): IIdentifier {
    return this._id;
  }
  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<AttentionTagRef> {
    return Ok(new AttentionTagRef(new UniqueEntityID(id)));
  }
}
