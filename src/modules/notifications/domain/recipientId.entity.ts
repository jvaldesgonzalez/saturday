import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export type Empty = Record<never, never>;

export class RecipientId extends DomainEntity<Empty> {
  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: string): Result<RecipientId> {
    return Ok(new RecipientId(new UniqueEntityID(id)));
  }
}
